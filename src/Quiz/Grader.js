import { purify } from '../utils.js'

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
    finish(answers, questions) {
        // switch to results pane
        window.latinstudier.switcher.showPane("quiz-results");
    }
}