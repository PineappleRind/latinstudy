import { WalkthroughMan } from "./index.js";

import {
	formulateQuestionFromEndingGroup as endings,
	formulateVocabQuestion as vocab,
} from "./formulators/index.js";

import type { QuizOptions, QuizQuestion } from "@/types/quiz";
import type {
	CaseEnding,
	ConjugationEnding,
	Conjugations,
	Declensions,
	ParsedEndingsData,
	VocabWord,
} from "@/types/parsedData";

/**
 * Handles the formulation of the questions based on JSON data, and sends them to WalkthroughMan to start the quiz.
 * */
export class Formulator {
	options: QuizOptions;
	/** Finished QuizQuestion formulations. */
	questions: QuizQuestion[];

	constructor(options: QuizOptions) {
		this.options = options;
		this.questions = [];
	}
	questionFormulators = { endings, vocab };
	/**
	 * Generate questions and initialize WalkthroughMan with them.
	 * @param endings JSONResource containing arrays of conjugations, declensions, and personal pronouns. There should be a type for this!
	 * @param vocab JSONResource containing an array of all vocab words.
	 */
	initialize(endings: ParsedEndingsData, vocab: VocabWord[]): void {
		this.generateQuestions(endings, vocab);
		new WalkthroughMan(this.options).initialize(this.questions);
	}
	/**
	 * Requests all necessary questions to be generated by the formulators.
	 * Same parameters as {@link Formulator.initialize}
	 * @returns a list of quesitons.
	 */
	generateQuestions(endings: ParsedEndingsData, vocab: VocabWord[]) {
		// Only get from the conjugations or declensions enabled
		const enabledDeclensions = this.enabledEndingGroup(
			endings.declensions,
			"declensions",
		);
		const enabledConjugations = this.enabledEndingGroup(
			endings.conjugations,
			"conjugations",
		);

		this.questions.push(
			...this.questionFormulators.vocab(vocab, this.options.vocabNum),
		);

		for (const declensionNumber in enabledDeclensions) {
			const declension = enabledDeclensions[declensionNumber] as CaseEnding[];
			this.questions.push(
				...this.questionFormulators.endings(
					"declensions",
					+declensionNumber + 1,
					declension,
				),
			);
		}
		for (const conjugation in enabledConjugations) {
			const enabledEndings = (
				enabledConjugations[conjugation] as ConjugationEnding[]
			).filter((ending) => {
				// should be unreachable
				if (!this.options.conjugationSettings) {
					window.latinstudier.switcher.showPane("quiz-start");
					throw new Error(
						"Conjugations enabled but no characteristics specified!",
					);
				}
				const { voices, moods, persons, tenses } =
					this.options.conjugationSettings;
				return (
					voices.includes(ending.voice) ||
					moods.includes(ending.mood) ||
					persons.includes(ending.person) ||
					tenses.includes(ending.tense)
				);
			});

			this.questions.push(
				...this.questionFormulators.endings(
					"conjugations",
					+conjugation + 1,
					enabledEndings, // TODO FIX THIS
				),
			);
		}
	}
	/**
	 * @param endings Object of declension/conjugation endings (includes 1, 2, 3, 4, and 5).
	 * @returns Object of declension endings — only includes what the user selected, if any.
	 */
	enabledEndingGroup(
		endings: Declensions | Conjugations,
		type: "declensions" | "conjugations",
	): Declensions | Conjugations {
		const enabled = {};
		for (let i = 0; i < Object.keys(endings).length; i++) {
			// 2 to the power of i is i's binary counterpart
			// for example, if i was 3, bj = 8 = 0b01000
			const bj = 2 ** i;

			// If  1, 2, 4, 8, or 16 is found, then enable
			// declensions 1, 2, 3, 4, or 5, respectively
			if ((bj & this.options[type]) === bj) enabled[i] = endings[i + 1];
		}
		return enabled;
	}
}
