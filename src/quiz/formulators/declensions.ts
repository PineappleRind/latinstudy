import { ord } from "../../utils.js";
import { createQuizQuestion } from "../components/index.js";
import type { CaseEnding } from "../../dataHandlers/parse/types.js";
import type { QuizQuestion as Formulation } from "../types.js";

/**
 * Generates a list of questions about a certain declension.
 * @param declnum Declension to generate on.
 * @param endings Data itself.
 * @returns An array of question Formulations.
 */
export function formulateDeclensionQuestion(
	declnum: number,
	declension: CaseEnding[],
) {
	const questions: Formulation[] = [];
	for (const ending of declension) {
		if (ending.ending === "-" || !ending.ending) continue; // no ending? continue
		const question = formatQuestionString(declnum, ending);
		const answer = ending.ending;
		// format the question
		const formulation: Formulation = {
			type: "declension",
			question,
			answer,
			html: createQuizQuestion({
				title: question,
				super: "what's the ending?",
			}),
		};
		// apply changes
		questions.push(formulation);
	}
	// Finished? Return!
	return questions;
}

/**
 * @param declnum Current declension, to specify in the string.
 * @param type
 * @returns The formatted question string (to ask the user).
 */
function formatQuestionString(declnum: number, ending: CaseEnding): string {
	// split the key into its information components
	// expand genders
	return `${ord(declnum.toString())} declension ${ending.case} ${
		ending.number
	} (${ending.gender})`;
}
