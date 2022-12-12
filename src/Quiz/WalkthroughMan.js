import Grader from './Grader.js';
import { $, createElement, wait, shuffleArray, renderAnswer } from '../utils.js'

// WalkthroughMan handles the showing of the questions to the
// user, records the user's response, and sends them to Grader.

export default class WalkthroughMan {
    constructor() {
        // when walkthroughMan is initialized, load question 0
        this.curQuestionIndex = 0;
        this.container = $(".quiz-content-outer");
        this.btns = {
            prev: $(".quiz-prev"),
            next: $(".quiz-next")
        };
        this.userAnswers = [];
        this.questionTransition = 200; // ms
        this.grader = new Grader();
    }

    initialize(questions, options) {
        this.questions = shuffleArray(questions);
        this.options = options;

        //  1 = grade then next, 2 = next, 3 = finish
        this.timeTo = this.options.immediateGrade ? 1 : 2;

        // Load the first question
        this.loadQuestion(0, 0, 1)
            .then(() => this.defaultHeight = this.container.getBoundingClientRect().height);
        this.updateDisable();

        this.btns.next.addEventListener("click", () => {
            console.log(this.timeTo)
            // ready to grade, if necessary
            if (this.timeTo === 1) {
                this.gradeQuestion();
                this.timeTo = this.curQuestionIndex === this.questions.length - 1 ? 3 : 2;
            }

            // done grading and expecting to go to the next question?
            else if (this.timeTo === 2) {
                this.toQuestion.apply(this, [1, this.questionTransition])
                if (this.options.immediateGrade) this.timeTo = 1;
            }

            // finished grading and time to finish? 
            else if (this.timeTo === 3) {
                return this.grader.finish(questions);
            }

            this.updateNextBtn();
        });
        this.btns.prev.addEventListener("click", this.toQuestion.bind(this, -1, this.questionTransition));
        // If grading after each question is enabled
        // change "Next" button to "Grade"
        if (this.options.immediateGrade) this.btns.next.innerHTML = 'Grade';
    }

    toQuestion(n) {
        if (this.options.immediateGrade) this.btns.next.innerHTML = 'Grade';
        this.curQuestionIndex += n;
        this.loadQuestion(
            this.curQuestionIndex,
            this.questionTransition,
            n
        )
    }

    loadQuestion(index, delay, n) {
        if (!this.questions[index]) {
            this.curQuestionIndex -= n;
            return this.finishQuiz();
        }
        // Reset the height of the container
        let cor = 0;
        // if question is already graded add the height of the correct answer box
        if (Math.sign(n) < 0
            && this.options.immediateGrade
            && this.questions[index].graded !== null)
            cor = 25.5;
        this.container.style.height = this.defaultHeight + cor + 'px';
        // store some elements
        this.curInput = this.questions[index].html.querySelector("input");
        this.updateDisable();

        // Hide the container's contents and prepare it for the next content
        this.container.classList.add("hidden");
        this.container.style.width = `${this.getHTMLDimensions(
            this.questions[index].html,
            "width"
        )}px`;

        return new Promise(resolve => {
            // Wait a bit
            wait(delay).then(() => {
                // then replace the content and unhide
                if (this.container.children[0]) this.container.children[0].remove();
                this.container.append(this.questions[index].html);
                this.inputListen();
                this.container.classList.remove("hidden");
                resolve();
            });
        })
    }

    getHTMLDimensions(html, prop) {
        // Clone the node & measure it
        html.classList.add('invisible');
        document.body.append(html);
        let size = html.getBoundingClientRect()[prop];
        html.classList.remove('invisible');
        html.remove();
        return size;
    }

    updateDisable() {
        // disable the previous button if needed
        if (this.curQuestionIndex === 0) this.btns.prev.disabled = true;
        else this.btns.prev.disabled = false;
        // no input? disable next button
        if (!this.curInput?.value.replaceAll(" ", "") && !this.questions[this.curQuestionIndex].graded)
            this.btns.next.disabled = true;

        else this.btns.next.disabled = false;
    }

    updateNextBtn() {
        if (this.timeTo === 1) this.btns.next.innerHTML = 'Grade';
        else if (this.timeTo === 2) this.btns.next.innerHTML = 'Next';
        else if (this.timeTo === 3) this.btns.next.innerHTML = 'Finish';
    }

    inputListen() {
        this.curInput.onkeyup = (e) => {
            if (e.key === 'Enter') return this.btns.next.click();
            this.updateDisable();
            this.userAnswers[this.curQuestionIndex] = {
                response: this.curInput.value,
                graded: null,
            };
        };
    }

    gradeQuestion() {
        let cur = this.questions[this.curQuestionIndex];
        // if the question is already graded AND shown as graded,
        if (cur.graded && !this.options.immediateGrade) return;

        // get grade
        let userAnswer = this.userAnswers.map(m => m.response)[this.curQuestionIndex];
        let { isCorrect, answer } = this.grader.gradeQ(cur, this.userAnswers.map(m => m.response)[this.curQuestionIndex])

        function visualUpdate() {
            this.curInput.disabled = true;
            this.curInput.classList.add(isCorrect ? 'correct' : 'wrong');
            // Measure the new height once the correct answer is added
            // for a lovely animation. 😍
            let correct = createElement('div', 'class:quiz-correct-answer')
            correct.append(renderAnswer(answer));
            let nh = this.getHTMLDimensions(correct, 'height');
            this.container.style.height = this.defaultHeight + nh + 'px';
            this.container.children[0].append(correct);
        }
        // only update visually if immediate grading was specified
        if (this.options.immediateGrade) visualUpdate.apply(this);

        // Finally set the current question to graded
        this.questions[this.curQuestionIndex].graded = { isCorrect, answer, userAnswer };
        // and update the buttons
        this.updateDisable()
    }

    finishQuiz() {
        this.grader.finish(this.questions);
        this.questions = [];

        // reset
        this.timeTo = 1;
        this.userAnswers = [];
    }
}