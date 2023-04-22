import { expandKey } from "./index.js";
import type {
	Declensions,
	endingType,
	JSONEndingsData,
	ParsedEndingsData,
} from "./types";

export function parseEndingData(data: JSONEndingsData): ParsedEndingsData {
	const expanded: ParsedEndingsData = <any>{};
	for (const type in data) {
		expanded[type] = expandEndingData(data[type], type as endingType);
	}
	return expanded;
}

/** Takes in EndingData and returns Declensions | Conjugations | Pronouns.
 * It extracts information from the key to convert it into an object. */
function expandEndingData(
	data: JSONEndingsData[keyof JSONEndingsData],
	type: endingType,
): Declensions {
	const output = {};
	// for each conjugation number/declension number or similar
	for (const number in data) {
		const group = data[number];
		// for each ending
		for (const key in group) {
			const ending = group[key];
			const expanded = expandKey(key.split("/"), type);
			output[number] ??= [];
			output[number].push({ ending, ...expanded });
		}
	}
	return output;
}
