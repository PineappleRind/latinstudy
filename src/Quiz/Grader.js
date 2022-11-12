import { purify } from '../utils.js'

// Grader recieves the responses from WalkthroughMan, compares
// them to the questions, grades, and shows the grade to the user.

export default class Grader {
    constructor() { }
    initialize(userAnswers, questions) { }
    gradeQ(question, userAnswer) {
        // Empty input? Come on, User! :(
        if (!userAnswer) return false;
        // Remove accents to compare with correct answer
        userAnswer = purify(userAnswer);
        // Get correct answer and normalize that too
        let correct = purify(question.answer);
        // Isn't correct? Return wrong
        if (userAnswer !== correct) return false;
        // Correct? Return right
        return true;
    }
}