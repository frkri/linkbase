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
