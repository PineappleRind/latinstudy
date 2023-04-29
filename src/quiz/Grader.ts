import { $, createElement, purify, renderAnswer } from "../utils.js";
import type { QuizQuestion, QuizQuestionScore } from "@/types/quiz";

/** If the user makes more than ALLOWED_TYPOS, the question is marked wrong. */
export const ALLOWED_TYPOS = 1;

/**
 * Grader recieves the responses from WalkthroughMan, compares them to the questions, grades, and shows the grade to the user.
 * */
export class Grader {
	constructor() {}
	/** Do I really need this empty initialize? */
	initialize(userAnswers, questions) {}
	/**
	 * Grade the specified question
	 * @param question The question itself
	 * @param userAnswer What the user answered the question with
	 */
	gradeQuestion(question: QuizQuestion, userAnswer: string): QuizQuestionScore {
		// Remove accents to compare with correct answer
		userAnswer = purify(userAnswer);
		// If there are multiple answers
		const correct: string[] = ([] as string[]).concat(question.answer);
		// if one of the correct answers directly matches user's answer
		const directEquals = correct.some((el) => purify(el) === userAnswer);
		// if one of the correct answers fuzzily matches user's answer
		const fuzzyEquals = correct.some((el) => this.fuzzyEquals(userAnswer, el));

		if (directEquals) return 2;
		else if (fuzzyEquals) return 1;
		else return 0;
	}

	/** Match one string against another string, only allowing 1 mistake to consider them equal */
	fuzzyEquals(target: string, original: string) {
		target = purify(target);
		original = purify(original);

		if (target === original) return true;
		// if the word is really short, we can't tell if
		// the user actually made a typo - so mark wrong
		else if (original.length < 2) return false;

		let foundMistakes = ALLOWED_TYPOS;
		for (let i = 0; i < target.length; i++) {
			if (target.charAt(i) === original.charAt(i)) continue;

			foundMistakes--;
			if (foundMistakes < 0) return false;
		}

		return true;
	}
	/** Append all quiz question grades to the pane */
	showResults(questions: QuizQuestion[]) {
		// switch to results pane
		window.latinstudier.switcher.showPane("quiz-results");
		// count number correct
		$("#quiz-results-questions-inner").innerHTML = "";
		for (const [i, question] of questions.entries()) {
			const qSum = this.generateQuestionResult(i, question);
			if (!qSum) continue;
			$("#quiz-results-questions-inner").append(qSum);
		}

		// we know question.grade.score exists because generateQuestionResult would have thrown an error
		const numCorrect = questions
			.map((q) => q.grade?.score || 0)
			.reduce((acc: number, cur) => {
				return acc + (cur > 0 ? 1 : 0);
			}, 0);

		$("#quiz-results-percentage").textContent = (
			Math.round((numCorrect / questions.length) * 1000) / 10
		).toString();
		$("#quiz-results-num-correct").textContent = numCorrect.toString();
		$("#quiz-results-total").textContent = questions.length.toString();
	}

	generateQuestionResult(i: number, question: QuizQuestion): HTMLDivElement {
		if (!question.grade)
			throw new Error(`Quiz question "${question.question}" is ungraded!`);
		const qSum = createElement(
			"div",
			"class:quiz-results-q",
			`${i + 1}. ${question.question}: `,
		) as HTMLDivElement;
		const correctAnswer = createElement("span", "class:quiz-results-q-correct");
		correctAnswer.append(renderAnswer(question.answer));

		if (question.grade.score <= 0)
			qSum.append(
				createElement(
					"span",
					"class:quiz-results-q-wrong",
					question.grade.userAnswer,
				),
			);

		qSum.append(correctAnswer);

		return qSum;
	}
}
