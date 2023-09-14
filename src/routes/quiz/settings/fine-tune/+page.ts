import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import { enabledCategories } from "../stores";

export function load() {
	if (!get(enabledCategories).length)
		throw redirect(307, "/quiz/settings/categories");
}
