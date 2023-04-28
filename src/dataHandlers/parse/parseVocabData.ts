import type { VocabWord } from "./types";

export function parseVocabData(vocab: VocabWord[]) {
    return vocab
        .filter((w: VocabWord) => w.word && true)
        .map(w => ({ ...w, full: w.word + ", " + w.dictionary }));
}