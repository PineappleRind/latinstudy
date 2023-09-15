import { options } from "@/routes/quiz/settings/stores";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

export function load() {
	if (!get(options).enabled.length)
		throw redirect(307, "/quiz/settings/categories");
}
