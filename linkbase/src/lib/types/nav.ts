import { type Selected } from 'bits-ui';

export enum ViewType {
	canvas = 'canvas',
	grid = 'grid',
	list = 'list'
}

export enum OrderInnerType {
	name = 'name',
	created = 'created',
	modified = 'modified'
}

export type OrderType = Selected<OrderInnerType>;

export const orders: OrderType[] = [
	{ value: OrderInnerType.name, label: 'Order by name' },
	{ value: OrderInnerType.created, label: 'Order by created' },
	{ value: OrderInnerType.modified, label: 'Order by modified' }
];
