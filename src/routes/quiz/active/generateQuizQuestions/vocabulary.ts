import type { VocabWord as VocabularyWord } from "@/types/data";
import type { QuizQuestion } from "./types";
import { shuffleArray } from "@/utils/shuffleArray";

export function generateVocabQuestions(
	vocabulary: VocabularyWord[],
	amount: number,
) {
	const result: QuizQuestion[] = [];

	shuffleArray(vocabulary);

	for (let i = 0; i < (amount || vocabulary.length); i++) {
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
