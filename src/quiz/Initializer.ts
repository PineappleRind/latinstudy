import { Message, MultitoggleManager } from "../components/index.js";
import { StudierData } from "../dataHandlers/types.js";
import { $, $$ } from "../utils.js";
import { Formulator } from "./index.js";
import type { QuizOptions } from "./types.js";

/**
 * Fetches data and gets the user's selected settings.
 * @category Quiz
 */
export class Initializer {
	optionElements: { [key: string]: any };
	options: QuizOptions;
	data: StudierData;

	constructor() {
		this.optionElements = {
			declensions: $$(".quiz-declension-option"),
			vocabNum: $(".quiz-vocab-count"),
			immediateGrade: $("#quiz-immediate-grade"),
		};
		this.options = {
			declensions: 0b00000,
			vocabNum: 0,
			immediateGrade: true,
		};
	}
	/**
	 * It isn't necessary to pass the data straight through Initializer
	 * when you can just instantiate {@link Formulator} from {@link index.Studier}!
	 * But that's complicated and will require awaits and stuff. I haven't figured it out.
	 * @param data JSON data from {@link dataHandlers.DataHandler}.
	 */
	async initialize(data) {
		this.data = data;
		this.watchSettings();
	}
	/**
	 * Sets up event handlers for the quiz-begin pane.
	 * @returns Initializer
	 */
	watchSettings() {
		// Deal with selecting different declensions
		MultitoggleManager.instance.subscribeToGroup("quiz-decl", (_, values) => {
			this.options.declensions = values.reduce(
				(acc, cur) => acc ^ (2 ** (+cur - 1)),
				0b00000,
			);
			console.log(_, values);
		});

		$(".pane-trigger.quiz-begin").addEventListener(
			"click",
			this.beginQuiz.bind(this),
		);

		return this;
	}
	/**
	 * Event handler for the .quiz-begin button. Sends options to Formulator.
	 */
	beginQuiz() {
		if (this.quizIsEmpty()) {
			new Message(
				"No declensions and/or vocabulary question number specified.",
				2,
				4000,
			).show();
			// a bit of a hacky way to override Switcher;
			// since Switcher already switched BEFORE
			// beginQuiz is called, we have to switch back.
			window.latinstudier.switcher.showPane("quiz-start");
			return;
		}
		// get settings
		this.options.immediateGrade = this.optionElements.immediateGrade.checked;
		this.options.vocabNum = this.optionElements.vocabNum.value;

		new Formulator(this.options).initialize(
			{
				conjugations: this.data.conjugations,
				declensions: this.data.declensions,
				pronouns: this.data.pronouns,
			},
			this.data.vocab,
		);
	}

	/**
	 * @returns true if declension selection is empty AND vocab is set to off
	 * */
	quizIsEmpty = (): boolean =>
		!this.options.declensions && !this.optionElements.vocabNum.value;
}
