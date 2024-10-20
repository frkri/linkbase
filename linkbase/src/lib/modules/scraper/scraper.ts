import { getPreferredFromStorage } from '$lib/modules/storage/local/localStorage';
import { ItemStorageKeys } from '$lib/types/viewer';

export type ScrapedData = {
	url: URL;
	title: string | undefined;
	description: string | undefined;
	imgSrc: Blob | undefined;
	imgAlt: string | undefined;
};

export async function scrape(target: URL): Promise<null | ScrapedData> {
	try {
		return await scrapeWithLocal(target);
	} catch (error) {
		console.warn('Local scraper failed', error);
	}

	const remoteScraper = getPreferredFromStorage(ItemStorageKeys.remoteScraper);
	if (remoteScraper) {
		const remote = new URL(remoteScraper);
		try {
			return await scrapeWithRemote(target, remote);
		} catch (error) {
			console.warn('Remote scraper failed', error);
		}
	}

	return null;
}

async function scrapeWithRemote(target: URL, remote: URL): Promise<ScrapedData> {
	const response = await fetch(remote.toString(), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ url: target.toString() })
	});

	if (!response.ok) throw new Error('Failed to fetch from remote scraper');

	const formData = await response.formData();
	const jsonPart = formData.get('json');
	const imgPart = formData.get('image');

	if (!jsonPart || !imgPart) throw new Error('Invalid response format');

	const jsonData = JSON.parse(jsonPart.toString());
	const imgBlob = imgPart instanceof Blob ? new Blob([imgPart]) : undefined;

	return {
		url: new URL(jsonData.url),
		title: jsonData.title,
		description: jsonData.description,
		imgSrc: imgBlob,
		imgAlt: jsonData.imgAlt
	};
}

async function scrapeWithLocal(target: URL): Promise<ScrapedData> {
	const response = await fetch(target);
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
