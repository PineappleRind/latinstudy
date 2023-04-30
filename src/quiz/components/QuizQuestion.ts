import { createElement } from "../../utils.js";
import { QuizQuestionHTMLOptions } from "@/types/quiz";

/** Creates the HTML for a quiz question.
 * @param options parameters used for customizing certain titles.
 * @returns a quiz question wrapped in a div (.animator-inner).
 */
export function createQuizQuestion(
	options: QuizQuestionHTMLOptions,
): DocumentFragment {
	const title = createElement("h3", "class:quiz-question-title", options.title);
	const input = createElement(
		"input",
		"placeholder:What is it? Enter...;type:text;class:quiz-question-input",
	);
	const header = createElement(
		"h4",
		"class:quiz-question-super",
		options.super,
	);
	const container = new DocumentFragment();

	container.append(header, title, input);
	return container;
}
