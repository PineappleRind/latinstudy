import Grader from "./Grader.js";
import {
  $,
  createElement,
  wait,
  shuffleArray,
  renderAnswer,
} from "../utils.js";
import Animator from "./walkthroughHelpers/Animator.js";

// WalkthroughMan handles the showing of the questions to the
// user, records the user's response, and sends them to Grader.

export default class WalkthroughMan {
  constructor() {
    // when walkthroughMan is initialized, load question 0
    this.curQuestionIndex = 0;
    this.container = $(".quiz-content-outer");
    this.btns = {
      prev: $(".quiz-prev"),
      next: $(".quiz-next"),
    };
    this.userAnswers = [];
    this.questionTransition = 200; // ms
    this.grader = new Grader();
    this.animator = new Animator(this.container, {
      minWidth: 300
    });
  }

  initialize(questions, options) {
    this.questions = shuffleArray(questions);
    this.options = options;

    //  1 = grade then next, 2 = next, 3 = finish
    this.timeTo = this.options.immediateGrade ? 1 : 2;

    // If grading after each question is enabled
    // change "Next" button to "Grade"
    if (this.options.immediateGrade) this.btns.next.innerHTML = "Grade";

    // update current question indicator
    $("#count-total").textContent = this.questions.length;
    $("#count-current").textContent = "1";

    // Load the first question
    this.loadQuestion(0, 0, 1).then(
      () => (this.defaultHeight = this.container.getBoundingClientRect().height)
    );
    this.updateDisable();

    this.btns.next.addEventListener("click", this.listen.next.bind(this));
    this.btns.prev.addEventListener("click", this.listen.prev.bind(this));
  }

  toQuestion(n) {
    if (this.options.immediateGrade) this.btns.next.innerHTML = "Grade";
    this.curQuestionIndex += n;
    this.loadQuestion(this.curQuestionIndex, this.questionTransition, n);
  }

  loadQuestion(index, delay, n) {
    if (!this.questions[index]) {
      this.curQuestionIndex -= n;
      return this.finishQuiz();
    }

    // update the question indicator
    $("#count-current").textContent = (index + 1).toString();

    // if question is already graded make sure the button says Next and not Grade
    if (this.questions[index].graded) this.timeTo = 2;
    this.updateNextBtn();

    this.curInput = this.questions[index].html.querySelector("input");
    this.updateDisable();

    return new Promise(async (resolve) => {
      await this.animator.animateTo(this.questions[index].html, delay);
      this.listen.input();
      resolve();
    });
  }

  updateDisable() {
    // disable the previous button if needed
    if (this.curQuestionIndex === 0) this.btns.prev.disabled = true;
    else this.btns.prev.disabled = false;
    // no input? disable next button
    if (
      !this.curInput?.value.replaceAll(" ", "") &&
      !this.questions[this.curQuestionIndex].graded
    )
      this.btns.next.disabled = true;
    else this.btns.next.disabled = false;
  }

  updateNextBtn() {
    let map = ["Grade", "Next", "Finish"];
    this.btns.next.innerHTML = map[this.timeTo - 1];
  }

  listen = {
    next: () => {
      // time to grade
      if (this.timeTo === 1) {
        this.gradeQuestion();
        this.timeTo =
          this.curQuestionIndex === this.questions.length - 1 ? 3 : 2;
      }

      // done grading and expecting to go to the next question?
      else if (this.timeTo === 2) {
        // grade if the user has disabled immediate grading and it didn't grade before
        if (!this.options.immediateGrade) this.gradeQuestion();
        // next question
        this.toQuestion.apply(this, [1, this.questionTransition]);
        if (this.options.immediateGrade) this.timeTo = 1;
      }

      // finished grading and time to finish?
      else if (this.timeTo === 3) return this.finishQuiz();

      this.updateNextBtn();
    },
    prev: () => {
      this.toQuestion.apply(this, [-1, this.questionTransition]);
    },
    input: () => {
      onkeyup = (e) => {
        if (e.key === "Enter") return this.btns.next.click();
      };
      this.curInput.onkeyup = (e) => {
        this.updateDisable();
        this.userAnswers[this.curQuestionIndex] = {
          response: this.curInput.value,
          graded: null,
        };
      };
    },
  };

  updateGrade(isCorrect, answer) {
    // get the result
    let typeofAnswer = ["wrong", "partial-correct", "correct"][isCorrect];

    this.curInput.disabled = true;
    this.curInput.classList.add(typeofAnswer);
    // add correct answer
    let correct = createElement("div", "class:quiz-correct-answer");
    correct.append(renderAnswer(answer));
    // Measure the new height once the correct answer is added
    // for a lovely animation. 😍
    this.animator.animateAppend(correct, 200);
  }

  gradeQuestion() {
    let cur = this.questions[this.curQuestionIndex];
    // if the question is already graded AND shown as graded,
    if (cur.graded && !this.options.immediateGrade) return;

    // get grade
    let userAnswer = this.userAnswers.map((m) => m.response)[
      this.curQuestionIndex
    ];
    let isCorrect = this.grader.gradeQuestion(
      cur,
      this.userAnswers.map((m) => m.response)[this.curQuestionIndex]
    );

    // only update visually if immediate grading was specified
    if (this.options.immediateGrade) this.updateGrade(isCorrect, cur.answer);

    // Finally set the current question to graded
    this.questions[this.curQuestionIndex].graded = {
      isCorrect,
      answer: cur.answer,
      userAnswer,
    };
    // and update the buttons
    this.updateDisable();
  }

  finishQuiz() {
    this.grader.finish(this.questions);

    // reset
    this.questions = [];
    this.timeTo = 1;
    this.userAnswers = [];
    this.grader = new Grader();
  }
}
