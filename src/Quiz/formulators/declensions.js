import { ord, createElement } from "../../utils.js";

export default function declensions(declnum, endings) {
  let questions = [];
  for (const [type, ending] of Object.entries(endings)) {
    if (ending === "-") continue;
    let [gender, gnumber, $case] = type.split('|');
    // format the question
    let formulation = {
      question: toQuestion(declnum, gender, gnumber, $case),
      answer: ending
    };
    // add the answer & html
    formulation.html = generateDeclHTML(formulation);
    // apply changes
    questions.push(formulation);
  }
  // Finished? Return!
  console.log(questions)
  return questions;
}

function generateDeclHTML(questionData) {
  let title = createElement(
    "h3",
    "class:quiz-question-title",
    questionData.question
  ),
    input = createElement(
      "input",
      "placeholder:What is it? Enter...;type:text;class:quiz-question-input"
    ),
    container = createElement("div", "class:quiz-content-inner");

  container.append(title, input);
  return container;
}

function toQuestion(declnum, gender, gnumber, $case) {
  let map = (e) => {
    return {
      "n": "neuter",
      "m": "masculine",
      "f": "feminine",
      "s": "singular",
      "p": "plural",
    }[e]
  }
  return `${ord(declnum)} declension ${$case} ${map(gnumber)} ending (${gender.split('').map(map).join('/')})`;
}