import endings from "./endings.json";
import vocab from "./vocab.json";
import { preprocessEndings } from "./transform";
import type { ParsedEndingsData, VocabWord } from "../../../types/data";

export type JSONEndingsData = {
	declensions: Record<string, Record<string, string>>;
	conjugations: Record<string, Record<string, string>>;
	pronouns: Record<string, Record<string, string>>;
};

export default {
	endings: preprocessEndings(endings) as ParsedEndingsData,
	vocab: (vocab as VocabWord[])
		.filter((w: VocabWord) => w.word && true)
		.map((w) => {
			const full = `${w.word}${w.dictionary ? `, ${w.dictionary}` : ""}`;
			return { ...w, full };
		}),
};
