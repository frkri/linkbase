import type { Generated } from 'kysely';

export const DB_NAME = 'linkbase.db';

export type Schema = {
	links: LinksTable;
};

export interface LinksTable {
	id: Generated<number>;
	title: string;
	url: string;
	description: string;
	imgSrc: ArrayBuffer | null;
	imgType: null | string;
	imgAlt: null | string;
	createdAt: number;
	viewedAt: number;
	views: number;
}

export type LinkItem = { id: number } & Omit<LinksTable, 'id'>;
