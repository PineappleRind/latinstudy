import { json } from "@sveltejs/kit";
import data from "../data";
import { filterForRoute } from "../filterRoute";

export async function GET({ url: { searchParams } }) {
	const conjugation = searchParams.get("conjugation");
	if (conjugation && Number.isNaN(Number.parseInt(conjugation)))
		return new Response("Conjugation number not a number", { status: 400 });

	const endings = filterForRoute(searchParams, data.endings.conjugations);
	return json(endings);
}
