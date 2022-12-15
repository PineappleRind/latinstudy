import { $, createElement, ord } from "../utils.js";
import WalkthroughMan from "./WalkthroughMan.js";
// question generators
import declensions from "./formulators/declensions.js";
import vocab from "./formulators/vocab.js";
// Formulator handles the formulation of the questions based on
// JSON data, and sends them to WalkthroughMan to start the quiz.

export default class Formulator {
  constructor(options) {
    this.options = options;
    this.questions = [];
  }

  initialize(declensions, vocab) {
    // Only get from the declensions enabled
    let getFrom = {};
    console.log(this.options.declensions);
    // For every declension enabled
    for (let j = 0; j < Math.log2(16) + 1; j++) {
      // 5 declensions; base-2 logarithm of 16 = 4
      let bj = 2 ** j; // 2 to the power of J is its binary counterpart

      // If  1, 2, 4, 8, or 16 is found, then enable
      // declensions 1, 2, 3, 4, or 5, respectively
      if ((bj & this.options.declensions) === bj)
        getFrom[j] = declensions[j + 1];
    }

    this.questions.push(
      ...this.questionGenerators.vocab(vocab, this.options.vocabNum)
    );

    for (let declnum in getFrom)
      this.questions.push(
        ...this.questionGenerators.declensions.bind(this)(
          +declnum + 1,
          getFrom[declnum]
        )
      );

    new WalkthroughMan().initialize(this.questions, this.options);
  }

  questionGenerators = {
    vocab,
    declensions,
  };
}
