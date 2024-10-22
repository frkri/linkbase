import { browser, dev } from '$app/environment';
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

	if (!response.ok) {
		console.error('Failed to backup to remote');
		return false;
	}

	return true;
}

export async function downloadDatabaseFromRemote(remote: URL) {
	const response = await fetch(remote.toString(), {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		console.error('Failed to download from remote');
		return false;
	}

	const file = await response.blob();
	await dbInner.overwriteDatabaseFile(file);

	return true;
}
