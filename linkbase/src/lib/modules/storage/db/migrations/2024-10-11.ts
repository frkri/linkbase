import type { Kysely, Migration } from 'kysely';

import type { Schema } from '../schema';

export const Migration20241011: Migration = {
	async up(db: Kysely<Schema>) {
		await db.schema
			.createTable('links')
			.addColumn('id', 'integer', (cb) => cb.primaryKey().autoIncrement())
			.addColumn('title', 'text', (cb) => cb.notNull())
			.addColumn('url', 'text', (cb) => cb.notNull())
			.addColumn('description', 'text', (cb) => cb.notNull())
			.addColumn('imgSrc', 'blob')
			.addColumn('imgAlt', 'text')
			.addColumn('createdAt', 'integer', (cb) => cb.notNull())
			.addColumn('viewedAt', 'integer', (cb) => cb.notNull())
			.addColumn('views', 'integer', (cb) => cb.notNull())
			.execute();
	},
	async down(db: Kysely<Schema>) {
		await db.schema.dropTable('links').execute();
	}
};
