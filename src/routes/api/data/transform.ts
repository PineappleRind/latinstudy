import type { JSONEndingsData } from ".";
import type { ParsedEndingsData, gender } from "../../../types/data";

export function expandEndingData(
	/** conjugation number/declension number or similar */
	type: JSONEndingsData[keyof JSONEndingsData],
	typeName: keyof JSONEndingsData,
	/** extra fields to insert */
	extras?: Record<string, string>,
): ParsedEndingsData[keyof ParsedEndingsData] {
	const output = [];
	for (const [groupName, group] of Object.entries(type)) {
		for (const [key, ending] of Object.entries(group)) {
			const expandedKey = expandKey(key.split("/"), typeName);
			const expanded: any = { ending, ...expandedKey };
			if (typeName === "declensions") expanded.declension = +groupName;
			else if (typeName === "conjugations") expanded.conjugation = +groupName;
			output.push({ ...expanded, ...extras });
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
		const mapCategory = types[type][i] as keyof typeof maps;
		if (contraction === "-" || !maps[mapCategory]) {
			output[mapCategory] = contraction;
			continue;
		}
		// This is WILD.
		const expanded =
			maps[mapCategory][contraction as keyof (typeof maps)[keyof typeof maps]];
		if (!expanded) continue;
		// throw new Error(
		// `Invalid key ${data.join(
		// "/",
		// )}! Could not find an expansion for ${contraction}.`,
		// );

		output[mapCategory] = expanded;
	}
	return output;
}

const types: { [x in keyof JSONEndingsData]: string[] } = {
	declensions: ["gender", "number", "case"],
	conjugations: ["voice", "tense", "number", "person"],
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
		inf: "infinitive",
	},
};

// const typeMaps = {
// 	conjugations: {
// 		"i/1/a/pre,i/1/a/imp,i/1/a/fut": 9,
// 		"i/2/a/pre,i/2/a/imp,i/2/a/fut": 10,
// 		"i/3/a/pre,i/3/a/imp,i/3/a/fut": 12,
// 		"i/4/a/pre,i/4/a/imp,i/4/a/fut": 13,
// 		"i/4/a/pre,i/4/a/imp,i/4/a/fut": 13,
// 	},
// };
