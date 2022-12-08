import Grader from './Grader.js';
import { $, createElement, wait, shuffleArray } from '../utils.js'

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

        // Load the first question
        this.loadQuestion(0, 0, 1)
            .then(() => this.defaultHeight = this.container.getBoundingClientRect().height);
        this.updateBtns();

        this.btns.next.addEventListener("click", () => {
            // ready to grade, if necessary
            if (this.options.immediateGrade && this.btns.next.innerHTML === 'Grade') {
                this.gradeQuestion();
                this.btns.next.innerHTML = 'Next';
            }
            // time to finish? 
            else if (this.btns.next.innerHTML === 'Finish')
                this.grader.finish(this.userAnswers, questions);
            // finished grading and need to go to the next question?
            else if (this.btns.next.innerHTML !== 'Grade')
                this.toQuestion.apply(this, [1, this.questionTransition])

            if (this.curQuestionIndex === this.questions.length - 1) this.btns.next.innerHTML = 'Finish';
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
        this.updateBtns();

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

    updateBtns() {
        // disable the previous button if needed
        if (this.curQuestionIndex === 0) this.btns.prev.disabled = true;
        else this.btns.prev.disabled = false;
        // no input? disable next button
        if (!this.curInput?.value.replaceAll(" ", "") && !this.questions[this.curQuestionIndex].graded)
            this.btns.next.disabled = true;

        else this.btns.next.disabled = false;

        // finished?
        if (this.curQuestionIndex === this.questions.length - 1
            &&
            !this.options.immediateGrade) {
            this.btns.next.innerHTML = 'Finish'
        }
    }

    inputListen() {
        this.curInput.onkeyup = (e) => {
            this.updateBtns();
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
        let { isCorrect, answer } = this.grader.gradeQ(cur, this.userAnswers.map(m => m.response)[this.curQuestionIndex])
        console.log(isCorrect, answer)
        function visualUpdate() {
            this.curInput.disabled = true;
            this.curInput.classList.add(isCorrect ? 'correct' : 'wrong');
            // Measure the new height once the correct answer is added
            // for a lovely animation. 😍
            let correct = createElement('div', 'class:quiz-correct-answer', answer)
            let nh = this.getHTMLDimensions(correct, 'height');
            this.container.style.height = this.defaultHeight + nh + 'px';
            this.container.children[0].append(correct);
        }
        // only update visually if immediate grading was specified
        if (this.options.immediateGrade) visualUpdate.apply(this);

        // Finally set the current question to graded
        this.questions[this.curQuestionIndex].graded = { isCorrect, answer };
        // and update the buttons
        this.updateBtns()
    }

    finishQuiz() {
        this.grader.finish(this.userAnswers, this.questions);
    }
}