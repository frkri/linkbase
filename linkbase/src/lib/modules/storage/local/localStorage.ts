const STORAGE_PREFIX = 'preferred_';

export function getPreferredFromStorage(key: string) {
	return localStorage.getItem(STORAGE_PREFIX + key);
}

export function setPreferredToStorage(key: string, value: string) {
	localStorage.setItem(STORAGE_PREFIX + key, value);
}
