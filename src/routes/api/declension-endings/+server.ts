import { json } from "@sveltejs/kit";
import data from "../data";
import { filterForRoute } from "../filterRoute";

export async function GET({ url: { searchParams } }) {
	const declension = searchParams.get("declension");
	if (declension && Number.isNaN(Number.parseInt(declension)))
		return new Response("Declension number not a number", { status: 400 });

	const endings = filterForRoute(searchParams, data.endings.declensions);
	return json(endings);
}
