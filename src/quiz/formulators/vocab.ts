import { shuffleArray } from "../../utils.js";
import { createQuizQuestion } from "../components/index.js";
import type { VocabWord } from "@/types/parsedData";
import type { QuizQuestion as Formulation } from "@/types/quiz";

/**
 * Generates a list of questions to quiz the user on vocabulary.
 * @param vocab Array of vocabulary words.
 * @param amount Number of words to generate.
 * @returns List of question Formulations.
 */
export function formulateVocabQuestion(vocab: VocabWord[], amount: number) {
	const result: Formulation[] = [];
	if (amount === 0) amount = vocab.length;

	shuffleArray(vocab);
	for (let i = 0; i < amount; i++) {
		const randomWord = vocab[i];

		result.push({
			type: "vocab",
			question: randomWord.word,
			answer: randomWord.translation,
			html: createQuizQuestion({
				title: randomWord.full,
				super: `translate the ${randomWord.type}`,
			}),
		});
	}
	return result;
}
