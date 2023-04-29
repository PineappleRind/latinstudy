import { ord } from "../../utils.js";
import { createQuizQuestion } from "../components/index.js";
import type { CaseEnding, ConjugationEnding } from "@/types/parsedData";
import type { QuizQuestion as Formulation } from "@/types/quiz";

/**
 * Generates a list of question {@link quiz.QuizQuestion}s
 * @param type "conjugations" | "declensions"
 * @param number Either the declension number or conjugation number to generate questions from
 * @param endings An array of CaseEndings or ConjugationEndings, already filtered by {@link quiz.Formulator} (using the user's settings)
 * @returns The finished question formulations
 */
export function formulateQuestionFromEndingGroup(
	type: keyof typeof formatQuestionString,
	number: number,
	endings: CaseEnding[] | ConjugationEnding[],
) {
	const questions: Formulation[] = [];
	for (const ending of endings) {
		if (!ending.ending || ending.ending === "-") continue;
		const question = formatQuestionString[type](
			number,
			ending as CaseEnding & ConjugationEnding,
		);
		const answer = ending.ending;

		const formulation: Formulation = {
			type,
			question,
			answer,
			html: createQuizQuestion({
				title: question,
				super: "what's the ending?",
			}),
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
		} tense ${ord(ending.person)} person ${ending.number}`;
	},
};
