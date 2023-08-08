import { purify } from "@/utils/purify";
import {
	QuizQuestionScore,
	type QuizQuestion,
} from "@/routes/quiz/active/generateQuizQuestions/types";

/**
 * Grade the specified question
 * @param question The question itself
 * @param userAnswer What the user answered the question with
 */
export function gradeQuestion(
	question: QuizQuestion,
	userAnswer: string,
): QuizQuestionScore {
	// Remove accents to compare with correct answer
	const rawUserAnswer = purify(userAnswer);
	// If there are multiple answers
	const correct: string[] = ([] as string[]).concat(question.answer);
	// if one of the correct answers directly matches user's answer
	const isDirectlyEqual = correct.some((el) => purify(el) === rawUserAnswer);
	// if one of the correct answers fuzzily matches user's answer
	const isFuzzyEqual = correct.some((el) => fuzzyEquals(rawUserAnswer, el));

	if (isDirectlyEqual) return QuizQuestionScore.Correct;
	else if (isFuzzyEqual) return QuizQuestionScore.Partial;
	else return QuizQuestionScore.Wrong;
}

const ALLOWED_TYPOS = 1;
/** Match one string against another string, only allowing 1 mistake to consider them equal */
function fuzzyEquals(target: string, original: string) {
	const rawTarget = purify(target);
	const rawOriginal = purify(original);

	if (rawTarget === rawOriginal) return true;
	// if the word is really short, we can't tell if
	// the user actually made a typo - so mark wrong
	else if (rawOriginal.length < 2 || rawTarget.length < 2) return false;

	let foundMistakes = ALLOWED_TYPOS;
	for (let i = 0; i < rawTarget.length; i++) {
		if (rawTarget.charAt(i) === rawOriginal.charAt(i)) continue;

		foundMistakes--;
		if (foundMistakes < 0) return false;
	}

	return true;
}
