import { get } from "svelte/store";
import { enabledCategories } from "../stores";
import { redirect } from "@sveltejs/kit";

export function load() {
	if (!get(enabledCategories).length)
		throw redirect(307, "/quiz/settings/categories");
}
