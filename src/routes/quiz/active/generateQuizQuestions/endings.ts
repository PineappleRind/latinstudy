import type { CaseEnding, ConjugationEnding } from "@/types/data";
import { ord } from "@/utils/ord.js";
import type { QuizQuestion } from "./types";

// This was copied from the original. The underlying architecture
// could definitely be improved and and totally refactored someday
export function generateEndingQuestions<
	T extends keyof typeof formatQuestionString,
>(
	type: keyof typeof formatQuestionString,
	endings: T extends "declensions" ? CaseEnding[] : ConjugationEnding[],
) {
	const questions: QuizQuestion[] = [];
	for (const ending of endings) {
		if (!ending.ending || ending.ending === "-") continue;
		const question = formatQuestionString[type](
			type === "declensions"
				? (ending as CaseEnding).declension
				: (ending as ConjugationEnding).conjugation,
			ending as CaseEnding & ConjugationEnding,
		);
		const answer = ending.ending;

		const formulation: QuizQuestion = {
			type,
			question,
			answer,
		};

		questions.push(formulation);
	}
	return questions;
}

/**
 * Takes a few characteristics about the ending and turns it into a string to ask the user.
 */
const formatQuestionString = {
	declensions(declnum: number, ending: CaseEnding): string {
		return `${ord(declnum.toString())} declension ${ending.case} ${
			ending.number
		} (${ending.gender})`;
	},
	conjugations(conjugation: number, ending: ConjugationEnding): string {
		return `${ord(conjugation.toString())} conjugation ${ending.voice} ${
			ending.tense
		} tense ${ord(ending.person.toString())} person ${ending.number}`;
	},
};
