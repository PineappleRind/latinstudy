import { writable, type Writable } from "svelte/store";

export const enabledCategories: Writable<string[]> = writable([]);
