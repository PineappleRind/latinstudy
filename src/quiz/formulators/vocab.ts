import { createElement, shuffleArray } from "../../utils.js";
import { QuizQuestion } from "../../types.js";

export default function vocab(vocab, amount: number) {
  let result: QuizQuestion[] = [];
  if (amount === 0) amount = vocab.length;
  // shuffle
  shuffleArray(vocab);
  // For as many as the user wants,
  for (let i = 0; i < amount; i++) {
    // get a random vocab word from the vocab JSON
    let r = vocab[i];
    // then generate a vocab question
    result.push({
      type: "vocab",
      question: r.word,
      answer: r.translation,
      html: generateVocabHTML(r),
    });
  }
  return result;
}

function generateVocabHTML(questionData) {
  let title = createElement(
      "h3", "class:quiz-question-title",
      `${questionData.word}${questionData.dictionary ? ", " + questionData.dictionary : ""}`
    ),
    input = createElement(
      "input",
      "placeholder:What's the translation? Enter...;type:text;class:quiz-question-input"
    ),
    header = createElement("h4", "class:quiz-question-super", `translate the ${questionData.type}`),
    container = createElement("div", "class:animator-inner");

  container.append(header, title, input);
  return container;
}
