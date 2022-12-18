import { map, ord, createElement } from "../../utils.js";
export default function declensions(declnum, endings) {
  let questions = [];
  for (const [type, ending] of Object.entries(endings)) {
    // split the key into its information components
    let [gender, gnumber, $case] = type.split("|");

    if (ending === "-") continue; // no ending? continue

    // format the question
    let formulation = {
      question: toQuestion(declnum, gender, gnumber, $case),
      answer: ending,
    };
    // add the answer & html
    formulation.html = generateDeclHTML(formulation);
    // apply changes
    questions.push(formulation);
  }
  // Finished? Return!
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
    header = createElement("h4", "class:quiz-question-super", `what's the ending?`),
    container = createElement("div", "class:animator-inner");

  container.append(header, title, input);
  return container;
}

function toQuestion(declnum, gender, gnumber, $case) {
  let genders = gender
    .split("")
    .map((g) => map[g])
    .join("/");
  return `${ord(declnum)} declension ${map[$case]} ${map[gnumber]
    } (${genders})`;
}
