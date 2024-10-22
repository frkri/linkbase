import { browser, dev } from '$app/environment';
import { FetchError } from '$lib/modules/scraper/scraper';
import { Kysely, Migrator } from 'kysely';
import { SQLocalKysely } from 'sqlocal/kysely';

import { DB_NAME, type Schema } from './schema';

type Database = { dbInner: SQLocalKysely; db: Kysely<Schema> };
export const { dbInner, db } = browser
	? await getDatabase(DB_NAME, dev)
	: ({ dbInner: null, dbKysely: null } as unknown as Database);

async function getDatabase(databasePath: string, verbose: boolean): Promise<Database> {
	const dbInner = new SQLocalKysely({ databasePath, verbose });
	const db = new Kysely<Schema>({ dialect: dbInner.dialect });

	await runMigrations(db);
	return { dbInner, db };
}

async function runMigrations(db: Kysely<Schema>) {
	const migrator = new Migrator({
		db,
		provider: {
			async getMigrations() {
				const { migrations } = await import('./migrations');
				return migrations;
			}
		}
	});

	return migrator.migrateToLatest();
}

export async function uploadDatabaseToRemote(remote: URL) {
	const file = await dbInner.getDatabaseFile();
	const formData = new FormData();
	formData.append('db', file);

	const response = await fetch(remote.toString(), {
		method: 'POST',
		credentials: 'include',
		body: formData
	});

	if (response.status === 401) throw FetchError.Unauthorized;
	if (!response.ok) throw FetchError.Failed;

	return true;
}

export async function downloadDatabaseFromRemote(remote: URL) {
	const response = await fetch(remote.toString(), {
		method: 'GET',
		credentials: 'include'
	});

	if (response.status === 401) throw FetchError.Unauthorized;
	if (!response.ok) throw FetchError.Failed;

	const form = await response.formData();
	const dbPart = form.get('db');
	const dbFile = dbPart instanceof Blob ? new Blob([dbPart]) : null;

	if (!dbFile) {
		console.error('Failed to download database from remote');
		return false;
	}

	await dbInner.overwriteDatabaseFile(dbFile);
	await runMigrations(db);

	return true;
}
