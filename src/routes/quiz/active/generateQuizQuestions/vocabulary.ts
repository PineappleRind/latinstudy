import type { VocabWord as VocabularyWord } from "@/types/data";
import type { QuizQuestion } from "./types";
import { shuffleArray } from "@/utils/shuffleArray";

export function generateVocabQuestions(
	vocabulary: VocabularyWord[],
	amount: number,
) {
	const result: QuizQuestion[] = [];

	if (amount === 0) amount = vocabulary.length;
	shuffleArray(vocabulary);
	for (let i = 0; i < amount; i++) {
		const randomWord = vocabulary[i];

		result.push({
			type: "vocab",
			question: randomWord.word,
			answer: randomWord.translation,
			word: randomWord,
		});
	}
	return result;
}
