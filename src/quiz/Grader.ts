import { QuizQuestion } from "../types.js";
import { $, createElement, purify, renderAnswer } from "../utils.js";

// Grader recieves the responses from WalkthroughMan, compares
// them to the questions, grades, and shows the grade to the user.

export default class Grader {
  constructor() { }
  initialize(userAnswers, questions) { }

  gradeQuestion(question: QuizQuestion, userAnswer: string) {
    if (!userAnswer) return false;
    // Remove accents to compare with correct answer
    userAnswer = purify(userAnswer);
    // If there are multiple answers
    let correct: string[] = [].concat(question.answer);
    // if one of the correct answers directly matches user's answer
    let directEquals = correct.some(el => purify(el) === userAnswer),
      // if one of the correct answers fuzzily matches user's answer
      fuzzyEquals = correct.some(el => this.fuzzyEquals(userAnswer, el));

    if (directEquals) return 2;
    else if (fuzzyEquals) return 1;
    else return 0;
  }

  fuzzyEquals(target: string, original: string) {
    target = purify(target);
    original = purify(original);

    if (target === original)
      return true;
    // if the word is really short, we can't tell if 
    // the user actually made a typo - so mark wrong
    else if (original.length < 2) return false;

    let foundMistakes = 1; // only allow 1 character difference
    for (let i = 0; i < target.length; i++) {
      if (target.charAt(i) === original.charAt(i)) continue;

      foundMistakes--;
      if (foundMistakes < 0) return false;
    }

    return true;
  }

  showResults(questions: QuizQuestion[]) {
    // switch to results pane
    window.latinstudier.switcher.showPane("quiz-results");
    // count number correct
    let numCorrect = 0;
    $('#quiz-results-questions-inner').innerHTML = '';
    for (let [i, question] of questions.entries()) {
      let qSum = createElement("div", "class:quiz-results-q", `${i + 1}. ${question.question}: `),
        qWrong = createElement("span", "class:quiz-results-q-wrong", question.graded.userAnswer),
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
}
