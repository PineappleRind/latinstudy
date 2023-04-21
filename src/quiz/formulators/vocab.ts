import { shuffleArray } from "../../utils.js";
import { createQuizQuestion } from "../components/QuizQuestion.js";
import { QuizQuestion as Formulation } from "../types.js";

/**
 * Generates a list of questions to quiz the user on vocabulary.
 * @param vocab Array of vocabulary words.
 * @param amount Number of words to generate.
 * @returns List of question Formulations.
 */
export function formulateVocabQuestion(vocab, amount: number) {
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
				title: randomWord.dictionary,
				super: `translate the ${randomWord.type}`,
			}),
		});
	}
	return result;
}
