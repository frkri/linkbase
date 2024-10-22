import { getPreferredFromStorage } from '$lib/modules/storage/local/localStorage';
import { ItemStorageKeys } from '$lib/types/viewer';

export type ScrapedData = {
	url: URL;
	title: string | undefined;
	description: string | undefined;
	imgSrc: Blob | undefined;
	imgAlt: string | undefined;
};

export enum FetchError {
	Unauthorized = 'Unauthorized to fetch',
	Failed = 'Failed to fetch',
	MissingJSON = 'Missing JSON part in response'
}

export async function scrape(target: URL): Promise<null | ScrapedData> {
	try {
		return await scrapeWithLocal(target);
	} catch (error) {
		console.warn('Local scraper failed', error);
	}

	const remoteScraper = getPreferredFromStorage(ItemStorageKeys.remoteScraper);
	if (remoteScraper) {
		const remote = new URL(remoteScraper);
		return await scrapeWithRemote(target, remote);
	}

	return null;
}

async function scrapeWithRemote(target: URL, remote: URL): Promise<ScrapedData> {
	const response = await fetch(remote.toString(), {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ url: target.toString() })
	});

	if (response.status === 401) throw FetchError.Unauthorized;
	if (!response.ok) throw FetchError.Failed;
	const formData = await response.formData();

	const jsonPart = formData.get('json');
	if (!jsonPart) throw FetchError.MissingJSON;
	const jsonData = JSON.parse(jsonPart.toString());

	const imgPart = formData.get('image');
	const imgBlob = imgPart != null && imgPart instanceof Blob ? new Blob([imgPart]) : undefined;

	return {
		url: new URL(jsonData.url),
		title: jsonData.title,
		description: jsonData.description,
		imgSrc: imgBlob,
		imgAlt: jsonData.imgAlt
	};
}

async function scrapeWithLocal(target: URL): Promise<ScrapedData> {
	const response = await fetch(target, { redirect: 'follow' });
	const doc = new DOMParser().parseFromString(await response.text(), 'text/html');

	const title =
		doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
		doc.querySelector('title')?.textContent ||
		undefined;
	const description =
		doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
		doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
		undefined;
	const imgSrc =
		doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
		doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
		doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ||
		doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
		undefined;
	const imgAlt =
		doc.querySelector('meta[property="og:image:alt"]')?.getAttribute('content') || undefined;

	const imgBlob = imgSrc
		? await fetch(new URL(imgSrc, target)).then((response) => response.blob())
		: undefined;
	return {
		url: target,
		title,
		description,
		imgSrc: imgBlob,
		imgAlt
	};
}
