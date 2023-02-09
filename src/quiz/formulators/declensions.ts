import { map, ord, createElement } from "../../utils.js";
import { QuizQuestion } from "../../types.js";

export default function declensions(declnum, endings) {
  let questions: QuizQuestion[] = [];
  for (const [type, ending] of Object.entries(endings)) {
    if (ending === "-" || !ending) continue; // no ending? continue

    let question = formatQuestionString(declnum, type),
      answer = ending.toString();
    // format the question
    let formulation: QuizQuestion = {
      type: "declension",
      question, answer,
      html: generateQuestionHTML({ question, answer })
    };
    // add the answer & html
    formulation.html = generateQuestionHTML(formulation);
    // apply changes
    questions.push(formulation);
  }
  // Finished? Return!
  return questions;
}

function generateQuestionHTML(questionData) {
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

function formatQuestionString(declnum: number, type: string): string {
  // split the key into its information components
  let [gender, gnumber, $case] = type.split("/");
  // expand genders
  let genders = gender
    .split("")
    .map((g) => map[g])
    .join("/");

  return `${ord(declnum.toString())} declension ${map[$case]} ${map[gnumber]
    } (${genders})`;
}
