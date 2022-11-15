import { $, createElement, wait } from '../utils.js'
import Grader from './Grader.js';

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

    initialize(questions) {
        this.questions = questions;
        this.loadQuestion(0, 0, 1)
            .then(() => {
                this.defaultHeight = this.container.getBoundingClientRect().height;
            });
        this.updateBtns();

        this.btns.next.addEventListener(
            "click",
            this.toQuestion.bind(this, 1, this.questionTransition)
        );
        this.btns.prev.addEventListener(
            "click",
            this.toQuestion.bind(this, -1, this.questionTransition)
        );
    }

    toQuestion(n, d) {
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
        this.container.style.height = this.defaultHeight + 'px';
        // store some elements
        this.curInput = this.questions[index].html.querySelector("input");
        this.btns.curGrade = this.questions[index].html.querySelector('.quiz-grade');
        // add event listener to grade button
        this.btns.curGrade.addEventListener('click', this.showPreliminaryGrade.bind(this));
        this.updateBtns();
        
        this.container.classList.add("hidden");
        this.container.style.width = `${this.getHTMLDimensions(
            this.questions[index].html,
            "width"
        )}px`;

        return new Promise(resolve => {
            wait(delay).then(() => {
                if (this.container.children[0]) this.container.children[0].remove();
                this.container.append(this.questions[index].html);
                this.inputListen();
                this.container.classList.remove("hidden");

                resolve();
            });
        })
    }

    getHTMLDimensions(html, prop) {
        html.classList.add('invisible');
        document.body.append(html);
        let size = html.getBoundingClientRect()[prop];
        html.classList.remove('invisible');
        html.remove();
        return size;
    }

    updateBtns() {
        if (this.curQuestionIndex === 0) this.btns.prev.disabled = true;
        else this.btns.prev.disabled = false;

        if (!this.curInput?.value.replaceAll(" ", ""))
            this.btns.next.disabled = true;
        else this.btns.next.disabled = false;
    }

    inputListen() {
        this.curInput.onkeyup = (e) => {
            this.updateBtns();
            this.userAnswers[this.curQuestionIndex] = {
                response: this.curInput.value,
                graded: false,
            };
        };
    }

    showPreliminaryGrade() {
        let cur = this.questions[this.curQuestionIndex];
        if (cur.graded) return;
        // Disable the input
        this.curInput.disabled = true;
        // Check if user is correct or wrong
        let grade = this.grader.gradeQ(cur, this.userAnswers.map(m => m.response)[this.curQuestionIndex])
        // Add class to input depending on grade
        this.curInput.classList.add(grade ? 'correct' : 'wrong');
        // Now measure the new height once the correct answer is added
        let correct = createElement('div', 'class:quiz-correct-answer', cur.answer)
        let nh = this.getHTMLDimensions(correct, 'height');
        this.container.style.height = this.defaultHeight + nh + 'px';
        this.container.children[0].append(correct);
        // Finally set the current question to graded
        this.questions[this.curQuestionIndex].graded = true;
    }

    finishQuiz() {
        this.grader.finish(this.userAnswers, this.questions);
    }
}