import type { VocabWord as VocabularyWord } from "@/types/data";
import { shuffleArray } from "@/utils/shuffleArray";
import type { QuizQuestion } from "./types";

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
