/// <reference no-default-lib="true"/>
/// <reference types="@sveltejs/kit" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, prerendered, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;
const assets = [...build, ...files, ...prerendered];

// Cache assets
sw.addEventListener('install', (event) => {
	event.waitUntil(caches.open(version).then((cache) => cache.addAll(assets)));
});

// Delete outdated caches
sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			for (const key of keys) {
				if (key !== version) await caches.delete(key);
			}
		})
	);
});

// Uses stale-while-revalidate strategy
sw.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);
	if (url.origin !== location.origin) return;

	event.respondWith(fetchWithCache(event.request));
});

async function fetchWithCache(request: Request) {
	const cache = await caches.open(version);
	const cachedResponse = await cache.match(request, {ignoreSearch: true});

	if (cachedResponse) {
		fetchAndCache(cache, request);
		return cachedResponse;
	}

	return fetchAndCache(cache, request);
}

async function fetchAndCache(cache: Cache, request: Request) {
	try {
		const networkResponse = await fetch(request);
		if (!networkResponse.ok) throw new Error(networkResponse.statusText);

		cache.put(request, networkResponse.clone());
		return networkResponse;
	} catch (error) {
		return new Response(error.message, { status: 503, statusText: 'Service Unavailable' });
	}
}
