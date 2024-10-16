import { createCancelablePromise } from '$lib/modules/common';
import { db } from '$lib/modules/storage/db/client';
import { ItemURLParams, OrderInnerType, orders } from '$lib/types/viewer';

import type { PageLoad } from './$types';

const abortController: AbortController = new AbortController();
const { signal } = abortController;

export const load = (async ({ url }) => {
	// Abort previous requests
	abortController.abort();

	const queryValue = url.searchParams.get(ItemURLParams.query);
	const orderValue = orders.find(
		(order) => order.value === url.searchParams.get(ItemURLParams.order)
	);

	let select = db.selectFrom('links').selectAll();
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

	return { items: createCancelablePromise(select.execute(), signal) };
}) satisfies PageLoad;
