import { $, createElement, purify, renderAnswer } from '../utils.js'

// Grader recieves the responses from WalkthroughMan, compares
// them to the questions, grades, and shows the grade to the user.

export default class Grader {
    constructor() { }
    initialize(userAnswers, questions) { }
    gradeQ(question, userAnswer) {
        console.log(question, userAnswer)
        // Empty input? Come on, User! :(
        if (!userAnswer) return false;
        // Remove accents to compare with correct answer
        userAnswer = purify(userAnswer);

        // If there are multiple answers
        if (question.answer.constructor === Array) {
            let correct = question.answer.map(purify);
            if (!correct.includes(userAnswer)) return { isCorrect: false, answer: question.answer };
            else return { isCorrect: true, answer: question.answer.join(', ') };
        }
        // if there's only 1 answer
        else {
            let correct = purify(question.answer);
            if (userAnswer !== correct) return { isCorrect: false, answer: question.answer };
            else return { isCorrect: true, answer: question.answer };
        }
        // Correct? Return right
    }
    finish(questions) {
        // switch to results pane
        window.latinstudier.switcher.showPane("quiz-results");
        let numCorrect = 0;

        for (let [i, question] of questions.entries()) {
            let qSum = createElement('div', 'class:quiz-results-q', `${i + 1}. ${question.question}: `),
                qWrong = createElement('span', 'class:quiz-results-q-wrong', question.graded.userAnswer),
                qCorrect = createElement('span', 'class:quiz-results-q-correct');

            qCorrect.append(renderAnswer(question.answer))

            if (question.graded.isCorrect === true) numCorrect++;
            else qSum.append(qWrong);
            qSum.append(qCorrect);
            $('#quiz-results-questions-inner').append(qSum);
        }

        $('#quiz-results-percentage').textContent = Math.round(numCorrect / questions.length * 1000) / 10
        $('#quiz-results-num-correct').textContent = numCorrect;
        $('#quiz-results-total').textContent = questions.length;
    }
}