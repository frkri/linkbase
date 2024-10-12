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
	imgSrc: string;
	imgAlt: string;
	createdAt: number;
	views: number;
}

export type LinkItem = {
	title: string;
	url: string;
	description: string;
	imgSrc: string;
	imgAlt: string;
	createdAt: number;
	views: number;
};
