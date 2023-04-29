import type { VocabWord } from "@/types/parsedData";

export function parseVocabData(vocab: VocabWord[]) {
	return vocab
		.filter((w: VocabWord) => w.word && true)
		.map((w) => {
			const full = `${w.word}${w.dictionary ? `, ${w.dictionary}` : ""}`;
			return { ...w, full };
		});
}
