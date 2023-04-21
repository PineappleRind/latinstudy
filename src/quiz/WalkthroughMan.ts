import { Grader } from "./Grader.js";
import { $, createElement, shuffleArray, renderAnswer } from "../utils.js";
import { Animator } from "./walkthroughHelpers/Animator.js";
import { QuizOptions, QuizQuestion } from "./types.js";

/**
 * Handles the showing of the questions to the user, records the user's response, and sends them to Grader.
 * It's a monstrous class that should be refactored somehow — like taking some functionality and making it a walkthroughHelper.
 */
export class WalkthroughMan {
	/** Keeps track of what question we're on. */
	currentIndex: number;
	/** How long it takes for one question to animate to another. */
	questionTransition: number;
	/** animator-outer */
	container: HTMLDivElement;
	/** Next and previous buttons. */
	btns: { prev: HTMLButtonElement; next: HTMLButtonElement };
	/** Stores all answers thus far.  */
	userAnswers: any[];
	/** Instance of {@link Grader}. */
	grader: Grader;
	/** Instance of {@link quiz.<internal>.Animator}. */
	animator: Animator;
	/** List of questions formulated by {@link Formulator}. */
	questions: QuizQuestion[];
	/** User's options collected by {@link Initializer}. */
	options: QuizOptions;
	/**
	 * What will happen next when the user clicks the next button.
	 * This needs a type! I don't know what to call it. I feel like this whole functionality should be in a walkthroughHelper.
	 * 1 = grade then next, 2 = next question, 3 = finish */
	nextEvent: number;
	/** The height of animator-outer in its default state, for {@link quiz.<internal>.Animator}. */
	defaultHeight: number;
	/** The input field of the current question. */
	curInput: any;

	constructor() {
		this.currentIndex = -1;
		this.container = $(".quiz-content-outer") as HTMLDivElement;
		this.btns = {
			prev: $(".quiz-prev") as HTMLButtonElement,
			next: $(".quiz-next") as HTMLButtonElement,
		};
		this.userAnswers = [];
		this.questionTransition = 200; // ms
		this.grader = new Grader();
		this.animator = new Animator(this.container, {
			minWidth: 300,
		});
	}

	initialize(questions: QuizQuestion[], options: QuizOptions) {
		this.questions = shuffleArray(questions);
		this.options = options;

		this.nextEvent = this.options.immediateGrade ? 1 : 2;

		// If grading after each question is enabled
		// change "Next" button to "Grade"
		if (this.options.immediateGrade) this.btns.next.innerHTML = "Grade";

		// update current question indicator
		$("#count-total").textContent = this.questions.length.toString();
		$("#count-current").textContent = "1";

		// Load the first question
		this.loadQuestion(1).then(
			() =>
				(this.defaultHeight = this.container.getBoundingClientRect().height),
		);
		this.updateDisable();

		this.btns.next.addEventListener("click", this.listen.next.bind(this));
		this.btns.prev.addEventListener("click", this.listen.prev.bind(this));
	}

	async loadQuestion(n: number) {
		if (!this.questions[this.currentIndex + n]) return this.finishQuiz();

		if (this.options.immediateGrade) this.btns.next.innerHTML = "Grade";
		this.currentIndex += n;

		// update the question indicator
		$("#count-current").textContent = (this.currentIndex + 1).toString();

		// if question is already graded make sure the button says Next and not Grade
		if (this.questions[this.currentIndex]?.grade) this.nextEvent = 2;
		this.updateNextBtn();

		this.curInput =
			this.questions[this.currentIndex].html.querySelector("input");
		this.updateDisable();

		await this.animator.animateTo(
			this.questions[this.currentIndex].html,
			this.questionTransition,
		);
		this.listen.input();

		return;
	}

	updateDisable() {
		// disable the previous button if needed
		if (this.currentIndex === 0) this.btns.prev.disabled = true;
		else this.btns.prev.disabled = false;
		// no input? disable next button
		if (
			!this.curInput?.value.replaceAll(" ", "") &&
			!this.questions[this.currentIndex]?.grade
		)
			this.btns.next.disabled = true;
		else this.btns.next.disabled = false;
	}

	updateNextBtn() {
		const map = ["Grade", "Next", "Finish"];
		this.btns.next.innerHTML = map[this.nextEvent - 1];
	}

	listen = {
		next: () => {
			// time to grade
			if (this.nextEvent === 1) {
				this.gradeQuestion();
				this.nextEvent =
					this.currentIndex === this.questions.length - 1 ? 3 : 2;
			}

			// done grading and expecting to go to the next question?
			else if (this.nextEvent === 2) {
				// grade if the user has disabled immediate grading and it didn't grade before
				if (!this.options.immediateGrade) this.gradeQuestion();
				// next question
				this.loadQuestion.apply(this, [1]);
				if (this.options.immediateGrade) this.nextEvent = 1;
			}

			// finished grading and time to finish?
			else if (this.nextEvent === 3) return this.finishQuiz();

			this.updateNextBtn();
		},
		prev: () => {
			this.loadQuestion.apply(this, [-1]);
		},
		input: () => {
			onkeyup = (e) => {
				if (e.key === "Enter") return this.btns.next.click();
			};
			this.curInput.onkeyup = () => {
				this.updateDisable();
				this.userAnswers[this.currentIndex] = {
					response: this.curInput.value,
					grade: null,
				};
			};
		},
	};

	updateGrade(score: number, answer: string | string[]) {
		// get the result
		const typeofAnswer = ["wrong", "partial-correct", "correct"][score];

		this.curInput.disabled = true;
		this.curInput.classList.add(typeofAnswer);
		// add correct answer
		const correct = createElement("div", "class:quiz-correct-answer");
		correct.append(renderAnswer(answer));
		// Measure the new height once the correct answer is added
		// for a lovely animation. 😍
		this.animator.animateAppend(correct);
	}

	gradeQuestion() {
		const cur = this.questions[this.currentIndex];
		// if the question is already graded AND shown as graded,
		if (cur?.grade && !this.options.immediateGrade) return;

		// get grade
		const userAnswer = this.userAnswers.map((m) => m.response)[
			this.currentIndex
		];
		const score = this.grader.gradeQuestion(
			cur,
			this.userAnswers.map((m) => m.response)[this.currentIndex],
		);

		// only update visually if immediate grading was specified
		if (this.options.immediateGrade) this.updateGrade(score, cur.answer);

		// Finally set the current question to graded
		this.questions[this.currentIndex].grade = {
			score,
			answer: cur.answer,
			userAnswer,
		};
		// and update the buttons
		this.updateDisable();
	}

	finishQuiz() {
		this.grader.showResults(this.questions);

		// reset
		this.questions = [];
		this.nextEvent = 1;
		this.userAnswers = [];
		this.grader = new Grader();
	}
}
