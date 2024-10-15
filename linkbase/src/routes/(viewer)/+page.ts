import type { LinksTable } from '$lib/modules/storage/db/schema';

import { db } from '$lib/modules/storage/db/client';
import { ItemURLParams, OrderInnerType, orders } from '$lib/types/viewer';

import type { PageLoad } from './$types';

let abortController: AbortController | null = null;

export const load = (async ({ url }) => {
	if (abortController) abortController.abort();

	abortController = new AbortController();
	const { signal } = abortController;

	let select = db.selectFrom('links').selectAll();

	const queryValue = url.searchParams.get(ItemURLParams.query);
	const orderValue = orders.find(
		(order) => order.value === url.searchParams.get(ItemURLParams.order)
	);

	if (queryValue && queryValue.length > 0) select = select.where('title', 'like', queryValue);
	switch (orderValue?.value) {
		case OrderInnerType.title:
			select = select.orderBy('title');
			break;
		case OrderInnerType.created:
			select = select.orderBy('createdAt');
			break;
		case OrderInnerType.viewed:
			select = select.orderBy('viewedAt');
			break;
		default:
			select = select.orderBy('title');
	}

	const queryWrapper = new Promise((resolve, reject) => {
		select.execute().then(resolve).catch(reject);

		signal.addEventListener('abort', () => {
			reject('Aborted previous request');
		});
	}) as unknown as Promise<LinksTable[]>;
	return { items: queryWrapper };
}) satisfies PageLoad;
