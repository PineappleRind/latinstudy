import { purify } from "@/utils/purify";
import {
	QuizQuestionScore,
	type QuizQuestion,
} from "./generateQuizQuestions/types";

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
	userAnswer = purify(userAnswer);
	// If there are multiple answers
	const correct: string[] = ([] as string[]).concat(question.answer);
	// if one of the correct answers directly matches user's answer
	const isDirectlyEqual = correct.some((el) => purify(el) === userAnswer);
	// if one of the correct answers fuzzily matches user's answer
	const isFuzzyEqual = correct.some((el) => fuzzyEquals(userAnswer, el));

	if (isDirectlyEqual) return QuizQuestionScore.Correct;
	else if (isFuzzyEqual) return QuizQuestionScore.Partial;
	else return QuizQuestionScore.Wrong;
}

const ALLOWED_TYPOS = 1;
/** Match one string against another string, only allowing 1 mistake to consider them equal */
function fuzzyEquals(target: string, original: string) {
	target = purify(target);
	original = purify(original);

	if (target === original) return true;
	// if the word is really short, we can't tell if
	// the user actually made a typo - so mark wrong
	else if (original.length < 2 || target.length < 2) return false;

	let foundMistakes = ALLOWED_TYPOS;
	for (let i = 0; i < target.length; i++) {
		if (target.charAt(i) === original.charAt(i)) continue;

		foundMistakes--;
		if (foundMistakes < 0) return false;
	}
	console.log(foundMistakes);

	return true;
}
