export type LinkItem = {
	createdAt: Date;
	description: string;
	icon: LinkItemIcon;
	title: string;
	url: URL;
	views: number;
};

export type LinkItemIcon = {
	alt: string;
	src: string;
};
