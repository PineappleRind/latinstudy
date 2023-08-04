import { json } from "@sveltejs/kit";
import data from "../data";
import { filterForRoute } from "../filterRoute";

export async function GET({ url: { searchParams } }) {
	const endings = filterForRoute(searchParams, data.endings.pronouns);
	return json(endings);
}
