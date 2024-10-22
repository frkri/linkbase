import { getPreferredFromStorage } from '$lib/modules/storage/local/localStorage';
import { CancelReason, ItemStorageKeys } from '$lib/types/viewer';

/**
 * Tries to get a value from in this order:
 * 1. URL parameter
 * 2. Local storage
 * 3. Finally Fallback
 *
 * @param url
 * @param urlParameter
 * @param localStorageKey
 * @param fallback
 */
export function getPrefferedFromMultiple<T>(
	url: URL,
	urlParameter: string,
	localStorageKey: string,
	fallback: T
) {
	const value = url.searchParams.get(urlParameter);
	return value ? value : getPreferredFromStorage(localStorageKey) || fallback;
}

export function setParameter(params: URLSearchParams, name: string, value: string) {
	if (value.length === 0) params.delete(name);
	else params.set(name, value.trimEnd());
}

export function createCancelablePromise<T>(promise: Promise<T>, signal: AbortSignal) {
	return new Promise<T>((resolve, reject) => {
		try {
			promise.then(resolve).catch(reject);
			signal.addEventListener('abort', () => {
				reject(CancelReason.aborted);
			});
		} catch {
			// expected error
		}
	});
}

export function downloadItem(filename: string, url: string) {
	const a = document.createElement('a');
	a.download = filename;
	a.href = url;
	a.click();
	a.remove();
}

export function requestAuthorization() {
	const authURL = getPreferredFromStorage(ItemStorageKeys.remoteAuthURL);
	if (authURL) window.open(authURL, '_blank', 'width=400,height=700,toolbar=0,menubar=0');
}