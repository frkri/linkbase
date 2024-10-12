import { type Migration } from 'kysely';

import { Migration20241011 } from './migrations/2024-10-11';

export const migrations: Record<string, Migration> = {
	'2024-10-11': Migration20241011
};
