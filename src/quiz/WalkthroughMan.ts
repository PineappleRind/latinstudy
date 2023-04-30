import { Grader } from "./index.js";
import { $, createElement, shuffleArray, renderAnswer } from "../utils.js";
import { ContainerAnimator } from "./helpers/index.js";
import type { QuizAnswer, QuizOptions, QuizQuestion } from "@/types/quiz";

enum NextEvent {
	Idle = 0,
	Grade = 1,
	Next = 2,
	Finish = 3,
}

/**
 * Handles the showing of the questions to the user, records the user's response, and sends them to Grader.
 * It's a monstrous class that should be refactored somehow — like taking some functionality and making it a walkthroughHelper.
 */
export class WalkthroughMan {
	/** Keeps track of what question we're on. */
	currentIndex: number;
	/** How long it takes for one question to animate to another. */
	questionTransition: number;
	/** ContainerAnimator container */
	container: HTMLDivElement;
	/** Next and previous buttons. */
	btns: { prev: HTMLButtonElement; next: HTMLButtonElement };
	/** Stores all answers thus far.  */
	userAnswers: QuizAnswer[];
	/** Instance of {@link Grader}. */
	grader: Grader;
	/** Instance of {@link quiz.<internal>.Animator}. */
	animator: ContainerAnimator;
	/** List of questions formulated by {@link Formulator}. */
	questions: QuizQuestion[] = [];
	/** User's options collected by {@link Initializer}. */
	options: QuizOptions;
	/**
	 * What will happen next when the user clicks the next button.
	 * This needs a type! I don't know what to call it. I feel like this whole functionality should be in a walkthroughHelper.
	 * 1 = grade then next, 2 = next question, 3 = finish */
	nextEvent: NextEvent = NextEvent.Idle;
	/** The height of animator-outer in its default state, for {@link quiz.<internal>.Animator}. */
	defaultHeight: null | number = null;
	/** The input field of the current question. */
	currentInput: HTMLInputElement | any; // Sorry Rome, not sure what to do here

	constructor(options: QuizOptions) {
		this.currentIndex = -1;
		this.container = $(".quiz-content-outer") as HTMLDivElement;
		this.btns = {
			prev: $(".quiz-prev") as HTMLButtonElement,
			next: $(".quiz-next") as HTMLButtonElement,
		};
		this.userAnswers = [];
		this.questionTransition = 200; // ms
		this.grader = new Grader();
		this.animator = new ContainerAnimator(this.container, {
			minWidth: 300,
			transitionDuration: 200,
		});
		this.options = options;
	}

	initialize(questions: QuizQuestion[]) {
		this.questions = shuffleArray(questions);

		this.nextEvent = this.options.immediateGrade
			? NextEvent.Grade
			: NextEvent.Next;

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

		this.btns.next.addEventListener("click", this.events.next.bind(this));
		this.btns.prev.addEventListener("click", this.events.prev.bind(this));
	}

	async loadQuestion(n: number) {
		if (!this.questions[this.currentIndex + n]) return this.finishQuiz();

		if (this.options.immediateGrade) this.btns.next.innerHTML = "Grade";
		this.currentIndex += n;

		// update the question indicator
		$("#count-current").textContent = (this.currentIndex + 1).toString();

		// if question is already graded make sure the button says Next and not Grade
		if (this.questions[this.currentIndex]?.grade)
			this.nextEvent = NextEvent.Next;
		this.updateNextBtn();

		const input = this.questions[this.currentIndex].html.querySelector("input");
		if (!input)
			throw new Error(
				`Quiz question with index ${this.currentIndex} does not have an input`,
			);
		this.currentInput = input;
		this.updateDisable();

		this.animator.setContent(this.questions[this.currentIndex].html, true);
		this.events.input();
	}

	updateDisable() {
		// disable the previous button if needed
		if (this.currentIndex === 0) this.btns.prev.disabled = true;
		else this.btns.prev.disabled = false;
		// no input? disable next button
		if (
			!this.currentInput?.value.replaceAll(" ", "") &&
			!this.questions[this.currentIndex]?.grade
		)
			this.btns.next.disabled = true;
		else this.btns.next.disabled = false;
	}

	updateNextBtn() {
		const map = ["Grade", "Next", "Finish"];
		this.btns.next.innerHTML = map[this.nextEvent - 1];
	}

	events = {
		next: () => {
			// time to grade
			if (this.nextEvent === NextEvent.Grade) {
				this.gradeQuestion();
				this.nextEvent =
					this.currentIndex === this.questions.length - 1
						? NextEvent.Finish
						: NextEvent.Next;
			}

			// expecting to go to the next question?
			else if (this.nextEvent === 2) {
				// grade if the user has disabled immediate grading and it didn't grade before
				if (!this.options.immediateGrade) this.gradeQuestion();
				// now go to the next question
				this.loadQuestion.apply(this, [1]);
				// only be ready for grading if the current question isn't complete
				if (
					this.options.immediateGrade &&
					!this.questions[this.currentIndex].grade
				)
					this.nextEvent = 1;
			} else if (this.nextEvent === NextEvent.Finish) return this.finishQuiz();

			this.updateNextBtn();
		},
		prev: () => {
			this.loadQuestion.apply(this, [-1]);
		},
		input: () => {
			onkeyup = (e) => {
				if (e.key === "Enter") return this.btns.next.click();
			};
			this.currentInput.onkeyup = () => {
				this.updateDisable();
				this.userAnswers[this.currentIndex] = {
					response: this.currentInput.value,
					score: null,
				};
			};
		},
	};

	updateGrade(score: number, answer: string | string[]) {
		// get the result
		const typeOfAnswer = ["wrong", "partial-correct", "correct"][score];

		this.currentInput.disabled = true;
		this.currentInput.classList.add(typeOfAnswer);
		// add correct answer
		const correct = createElement("div", "class:quiz-correct-answer");
		correct.append(renderAnswer(answer));
		// Measure the new height once the correct answer is added
		// for a lovely animation. 😍
		this.animator.append(correct);
	}

	gradeQuestion() {
		const cur = this.questions[this.currentIndex];
		// if the question is already graded AND shown as graded,
		if (cur?.grade && !this.options.immediateGrade) return;

		// get grade
		const userAnswer = this.userAnswers.map((m) => m.response)[
			this.currentIndex
		];

		const score = this.grader.gradeQuestion(cur, userAnswer);

		// only update visually if immediate grading was specified
		if (this.options.immediateGrade) this.updateGrade(score, cur.answer);

		// Finally set the current question to graded
		this.userAnswers[this.currentIndex].score = score;
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
		this.nextEvent = NextEvent.Grade;
		this.userAnswers = [];
		this.grader = new Grader();
	}
}
