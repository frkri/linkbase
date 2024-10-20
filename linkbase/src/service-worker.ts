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

// Try to use the cache first, otherwise fetch and cache
async function fetchWithCache(request: Request) {
	const cache = await caches.open(version);
	const cachedResponse = await cache.match(request, { ignoreSearch: true });

	if (cachedResponse) {
		fetchAndCache(cache, request);
		return cachedResponse;
	}

	return fetchAndCache(cache, request);
}

async function fetchAndCache(cache: Cache, request: Request) {
	try {
		const networkResponse = await fetch(request);
		if (!networkResponse.ok) throw networkResponse;

		cache.put(request, networkResponse.clone());
		return networkResponse;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return new Response(null, { status: 404 });
	}
}
