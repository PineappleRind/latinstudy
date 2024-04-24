import type { ParsedEndingsData, VocabWord } from "../../../types/data";
import indicativeConjugations from "./endings/conjugations/indicative.json";
import subjunctiveConjugations from "./endings/conjugations/subjunctive.json";
import declensions from "./endings/declensions.json";
import pronouns from "./endings/pronouns/personal.json";
import { expandEndingData } from "./transform";

import vocab from "./vocab/index";

export type JSONEndingsData = {
	declensions: Record<string, Record<string, string>>;
	conjugations: Record<string, Record<string, string>>;
	pronouns: Record<string, Record<string, string>>;
};

export default {
	endings: {
		declensions: expandEndingData(declensions, "declensions"),
		conjugations: [
			...expandEndingData(indicativeConjugations, "conjugations", {
				mood: "indicative",
			}),
			...expandEndingData(subjunctiveConjugations, "conjugations", {
				mood: "subjunctive",
			}),
		],
		pronouns: expandEndingData(pronouns, "pronouns"),
	} as ParsedEndingsData,
	vocab: (vocab as VocabWord[])
		.filter((w: VocabWord) => w.word && true)
		.map((w) => {
			const full = `${w.word}${w.dictionary ? `, ${w.dictionary}` : ""}`;
			return {
				...w,
				translation: [w.translation].flat().map((x) => x.replaceAll("*", "")),
				full,
			};
		}),
};
