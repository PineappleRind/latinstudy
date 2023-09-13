import type { ParsedEndingsData, VocabWord } from "../../../types/data";
import endings from "./endings.json";
import { preprocessEndings } from "./transform";
import vocab from "./vocab.json";

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
