import { type Selected } from 'bits-ui';

export enum ItemURLParams {
	view = 'v',
	order = 'o',
	query = 'q'
}

export enum ItemStorageKeys {
	view = 'view',
	order = 'order',
	query = 'query'
}

export enum ViewType {
	canvas = 'canvas',
	grid = 'grid',
	list = 'list'
}

export enum OrderInnerType {
	title = 'title',
	created = 'created',
	viewed = 'modified'
}

export type OrderType = Selected<OrderInnerType>;

export const orders: OrderType[] = [
	{ value: OrderInnerType.title, label: 'Order by title' },
	{ value: OrderInnerType.created, label: 'Order by created' },
	{ value: OrderInnerType.viewed, label: 'Order by viewed' }
];

export enum CancelReason {
	aborted = 'Aborted previous request'
}
