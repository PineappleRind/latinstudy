import { get, writable, type Writable } from "svelte/store";

/**
 * An extension of Svelte's `writable` that also saves its state to localStorage and
 * automatically restores it.
 */
export default function storedWritable<T>(
	key: string,
	defaultValue: T,
): Writable<T> {
	const stored = localStorage.getItem(key);

	// Subscribe to window storage event to keep changes from another tab in sync.

	const w = writable<T>(stored ? JSON.parse(stored) : defaultValue);

	window?.addEventListener("storage", (event) => {
		if (event.key === key) {
			if (event.newValue === null) {
				w.set(defaultValue);
				return;
			}

			w.set(JSON.parse(event.newValue));
		}
	});

	function set(...args: Parameters<typeof w.set>) {
		w.set(...args);
		localStorage.setItem(key, JSON.stringify(get(w)));
	}
	function update(...args: Parameters<typeof w.update>) {
		w.update(...args);
		localStorage.setItem(key, JSON.stringify(get(w)));
	}
	function clear() {
		w.set(defaultValue);
		localStorage.removeItem(key);
	}

	return {
		subscribe: w.subscribe,
		set,
		update,
		clear,
	};
}

export const previousPage = writable<string | null>(null);
