import { redirect } from "@sveltejs/kit";

export function load() {
	throw redirect(307, "/quiz/settings/categories");
}
