import { type Writable, writable } from "svelte/store";

export const enabledCategories: Writable<string[]> = writable([]);
