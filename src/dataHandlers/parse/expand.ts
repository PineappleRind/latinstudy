import type { endingType } from "./types";

export function expandKey(data: string[], type: endingType) {
	const output: Record<keyof typeof maps, string> = <any>{};
	for (const [i, contraction] of data.entries()) {
		const mapCategory = types[type][i];
		if (contraction === "-" || !maps[mapCategory]) {
			output[mapCategory] = contraction;
			continue;
		}
		const expanded = maps[mapCategory][contraction];
		if (!expanded)
			throw new Error(
				`Invalid key ${data.join(
					"/",
				)}! Could not find an expansion for ${contraction}.`,
			);

		output[mapCategory] = expanded;
	}
	return output;
}

const types: { [x in endingType]: string[] } = {
	declensions: ["gender", "number", "case"],
	conjugations: ["voice", "mood", "tense", "number", "person"],
	pronouns: ["gender", "number", "case"],
};

const maps = {
	gender: {
		m: "masculine",
		f: "feminine",
		n: "neuter",
	},
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
	},
};
