import { createElement, shuffleArray } from "../../utils.js";
import QuizQuestion from "../components/QuizQuestion";
import { QuizQuestion as Formulation } from "../types.js";

export default function vocab(vocab, amount: number) {
  let result: Formulation[] = [];
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
      html: new QuizQuestion().create({ title: r.dictionary, super: "translate the " + r.type }),
    });
  }
  return result;
}

