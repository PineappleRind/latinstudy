import type { ParsedEndingsData, VocabWord } from "../../../types/data";
import declensions from "./endings/declensions.json";
import conjugations from "./endings/conjugations.json";
import pronouns from "./endings/pronouns.json";
import { preprocessEndings } from "./transform";
import vocab from "./vocab.json";

export type JSONEndingsData = {
	declensions: Record<string, Record<string, string>>;
	conjugations: Record<string, Record<string, string>>;
	pronouns: Record<string, Record<string, string>>;
};

export default {
	endings: preprocessEndings({
		declensions,
		conjugations,
		pronouns,
	}) as ParsedEndingsData,
	vocab: (vocab as VocabWord[])
		.filter((w: VocabWord) => w.word && true)
		.map((w) => {
			const full = `${w.word}${w.dictionary ? `, ${w.dictionary}` : ""}`;
			return { ...w, full };
		}),
};
