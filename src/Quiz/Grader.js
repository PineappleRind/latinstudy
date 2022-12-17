import { $, createElement, purify, renderAnswer } from "../utils.js";

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

    // If there are multiple answers
    if (question.answer.constructor === Array) {
      let correct = question.answer;
      let directEquals = correct.some(el=>purify(el) === purify(userAnswer)),
        fuzzyEquals = correct.some(el=>this.equals(el,userAnswer))

      if (directEquals) return 2;
      else if (fuzzyEquals) return 1;
      else return 0;
    }
    // if there's only 1 answer
    else {
      let directEquals = userAnswer === purify(question.answer),
        fuzzyEquals = this.equals(userAnswer, question.answer)
      if (directEquals) return 2;
      else if (fuzzyEquals) return 1;
      else return 0;
    }
    // Correct? Return right
  }
  finish(questions) {
    console.log(questions)
    // switch to results pane
    window.latinstudier.switcher.showPane("quiz-results");
    let numCorrect = 0;
    $('#quiz-results-questions-inner').innerHTML = '';
    for (let [i, question] of questions.entries()) {
      let qSum = createElement(
        "div",
        "class:quiz-results-q",
        `${i + 1}. ${question.question}: `
      ),
        qWrong = createElement(
          "span",
          "class:quiz-results-q-wrong",
          question.graded.userAnswer
        ),
        qCorrect = createElement("span", "class:quiz-results-q-correct");

      qCorrect.append(renderAnswer(question.answer));

      if (question.graded.isCorrect > 0) numCorrect++;
      else qSum.append(qWrong);
      qSum.append(qCorrect);
      $("#quiz-results-questions-inner").append(qSum);
    }

    $("#quiz-results-percentage").textContent =
      Math.round((numCorrect / questions.length) * 1000) / 10;
    $("#quiz-results-num-correct").textContent = numCorrect;
    $("#quiz-results-total").textContent = questions.length;
  }
  equals(word1, word2) {
    word1 = purify(word1);
    word2 = purify(word2);

    if (word1 === word2)
      return true;

    let foundMistakes = 1; // only allow 1 character difference
    for (let i = 0; i < word1.length; i++) {
      if (word1.charAt(i) === word2.charAt(i)) continue;

      foundMistakes--;
      if (foundMistakes < 0) return false;
    }

    return true;
  }
}
