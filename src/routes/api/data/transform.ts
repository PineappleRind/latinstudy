import type { JSONEndingsData } from ".";
import type { ParsedEndingsData, gender } from "../../../types/data";

export function preprocessEndings(data: JSONEndingsData): ParsedEndingsData {
	const expanded: ParsedEndingsData = {} as ParsedEndingsData;

	for (const [typeName, type] of Object.entries(data)) {
		expanded[typeName as keyof ParsedEndingsData] = expandEndingData(
			type,
			typeName as keyof JSONEndingsData,
		);
	}
	return expanded;
}

function expandEndingData(
	/** conjugation number/declension number or similar */
	type: JSONEndingsData[keyof JSONEndingsData],
	typeName: keyof JSONEndingsData,
) {
	const output = [];
	for (const [groupName, group] of Object.entries(type)) {
		for (const [key, ending] of Object.entries(group)) {
			const expandedKey = expandKey(key.split("/"), typeName);
			const expanded: any = { ending, ...expandedKey };
			if (typeName === "declensions") expanded.declension = +groupName;
			else if (typeName === "conjugations") expanded.conjugation = +groupName;
			output.push(expanded);
		}
	}
	return output;
}

export function expandKey(data: string[], type: keyof JSONEndingsData) {
	const output: Record<keyof typeof maps, string> = {} as Record<
		keyof typeof maps,
		string
	>;
	for (const [i, contraction] of data.entries()) {
		const mapCategory: string = types[type][i];
		if (contraction === "-" || !maps[mapCategory as keyof typeof maps]) {
			output[mapCategory as keyof typeof maps] = contraction;
			continue;
		}
		// This is WILD.
		const expanded =
			maps[mapCategory as keyof typeof maps][
				contraction as keyof typeof maps[keyof typeof maps]
			];
		if (!expanded)
			throw new Error(
				`Invalid key ${data.join(
					"/",
				)}! Could not find an expansion for ${contraction}.`,
			);

		output[mapCategory as keyof typeof maps] = expanded;
	}
	return output;
}

const types: { [x in keyof JSONEndingsData]: string[] } = {
	declensions: ["gender", "number", "case"],
	conjugations: ["voice", "mood", "tense", "number", "person"],
	pronouns: ["gender", "number", "case"],
};

const maps = {
	gender: {
		m: "masculine",
		f: "feminine",
		n: "neuter",
	} as Record<string, gender>,
	number: {
		s: "singular",
		p: "plural",
	},
	case: {
		nom: "nominative",
		gen: "genitive",
		dat: "dative",
		acc: "accusative",
		abl: "ablative",
		voc: "vocative",
	},
	voice: {
		a: "active",
		p: "passive",
	},
	mood: {
		i: "indicative",
		im: "imperative",
	},
	tense: {
		pre: "present",
		imp: "imperfect",
		fut: "future",
		per: "perfect",
		plu: "pluperfect",
		ftp: "future perfect",
	},
};
