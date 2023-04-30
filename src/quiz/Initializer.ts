import { Message, MultitoggleManager } from "../components/index.js";
import { $, $$ } from "../utils.js";
import { Formulator } from "./index.js";

import type { StudierData } from "@/types/data";
import type { QuizOptions } from "@/types/quiz";

/**
 * Fetches data and gets the user's selected settings.
 * @category Quiz
 */
export class Initializer {
	optionElements: Record<string, HTMLInputElement>;
	options: QuizOptions;
	data: StudierData = <StudierData>{};

	constructor() {
		this.optionElements = {
			vocabNum: $(".quiz-vocab-count") as HTMLInputElement,
			immediateGrade: $("#quiz-immediate-grade") as HTMLInputElement,
		};
		this.options = {
			declensions: 0b00000,
			conjugations: 0b0000,
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
	async initialize(data: StudierData) {
		this.data = data;

		// $("#end-quiz").onclick = this.events.quizEnd;
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
		});
		MultitoggleManager.instance.subscribeToGroup("quiz-conj", (_, values) => {
			this.options.conjugations = values.reduce(
				(acc, cur) => acc ^ (2 ** (+cur - 1)),
				0b00000,
			);
			this.events.conjugationSelected();
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
				"No declensions, conjugations, or vocabulary question number selected.",
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
		this.options.vocabNum = parseInt(this.optionElements.vocabNum.value);

		new Formulator(this.options).initialize(
			{
				conjugations: this.data.conjugations,
				declensions: this.data.declensions,
				pronouns: this.data.pronouns,
			},
			this.data.vocab,
		);
	}

	events = {
		beginQuiz: this.beginQuiz,
		// endQuiz: (e: MouseEvent) => {
		// 	const btn = e.target as HTMLButtonElement;
		// 	// say what you mean and mean what you say
		// 	if (btn.dataset.confirming) actuallyEndQuiz();
		// 	else {
		// 		btn.dataset.confirming = "";
		// 		let iAmSure = btn.querySelector("#quiz-end-confirm") as HTMLButtonElement;
		// 		iAmSure.onclick = () => {

		// 		}
		// 	}
		// },
		conjugationSelected: () => {
			const fieldset = $("#quiz-conj-settings");
			if (this.options.conjugations <= 0) {
				fieldset.inert = true;
				fieldset.classList.add("hidden");
			} else {
				fieldset.inert = false;
				fieldset.classList.remove("hidden");
			}
		},
	};
	/**
	 * @returns true if declension selection is empty AND vocab is set to off
	 * */
	quizIsEmpty = (): boolean =>
		!this.options.declensions &&
		!this.options.conjugations &&
		!this.optionElements.vocabNum.value;
}
