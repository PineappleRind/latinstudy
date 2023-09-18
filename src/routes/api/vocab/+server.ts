import { json } from "@sveltejs/kit";
import data from "../data";
import { filterForRoute } from "../filterRoute";

export function GET({ url: { searchParams } }) {
	const words = filterForRoute(searchParams, data.vocab);
	return json(words);
}
