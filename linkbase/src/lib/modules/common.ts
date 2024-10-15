const STORAGE_PREFIX = 'preffered';

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
	return value ? value : getPrefferedFromStorage(localStorageKey) || fallback;
}

export function getPrefferedFromStorage(key: string) {
	return localStorage.getItem(STORAGE_PREFIX + key);
}

export function setPrefferedToStorage(key: string, value: string) {
	localStorage.setItem(STORAGE_PREFIX + key, value);
}

export function setParameter(params: URLSearchParams, name: string, value: string) {
	if (value.length === 0) params.delete(name);
	else params.set(name, value.trimEnd());
}
