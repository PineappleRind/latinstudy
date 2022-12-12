import { ord, createElement } from "../../utils.js";

export default function declensions(
  declnum,
  data,
  dataLevel = 0,
  formulation,
  cur = {},
  questions
) {
  // start off
  questions ??= [];
  cur.level ||= data;
  // For each key in the current level
  for (const [key, value] of Object.entries(cur.level)) {
    // New gender? Set it
    if (dataLevel === 0) cur.gender = key;
    // New grammatical number? Set it
    if (dataLevel === 1) cur.gnumber = key;
    // if it's on an ending
    if (dataLevel === 2) {
      if (value === "-") continue;
      // format the question
      formulation = {
        question: `${ord(declnum)} declension ${cur.gnumber} ${key} ending (${
          cur.gender
        })`,
      };
      // add the answer
      formulation.answer = value;
      // add HTML
      formulation.html = generateDeclHTML(formulation);
      // apply changes
      console.log(formulation);
      questions.push(formulation);
    }

    // Not finished? Recurse
    if (value === Object(value)) {
      cur.level = value;
      declensions.bind(this)(
        declnum,
        data,
        dataLevel + 1,
        formulation,
        cur,
        questions
      );
    }
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
    container = createElement("div", "class:quiz-content-inner");

  container.append(title, input);
  return container;
}
