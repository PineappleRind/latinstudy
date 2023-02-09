import { WalkthroughMan } from "./";
import { QuizOptions, QuizQuestion, VocabWord } from "./types";
// question generators
import declensions from "./formulators/declensions.js";
import vocab from "./formulators/vocab.js";
// Formulator handles the formulation of the questions based on
// JSON data, and sends them to WalkthroughMan to start the quiz.

export class Formulator {
  options: QuizOptions;
  questions: QuizQuestion[];
  constructor(options: QuizOptions) {
    this.options = options;
    this.questions = [];
  }

  initialize(endings, vocab: VocabWord[]): void {
    this.generateQuestions(endings, vocab);
    new WalkthroughMan().initialize(this.questions, this.options);
  }
  generateQuestions(endings, vocab: VocabWord[]) {
    // Only get from the declensions enabled
    let enabledDeclensions = this.enabledDeclensions(endings.declensions);

    this.questions.push(
      ...this.questionGenerators.vocab(vocab, this.options.vocabNum)
    );

    for (let declnum in enabledDeclensions)
      this.questions.push(
        ...this.questionGenerators.declensions.bind(this)(
          +declnum + 1,
          enabledDeclensions[declnum]
        )
      );
  }
  enabledDeclensions(declensions) {
    let enabledDeclensions = {};
    // For every declension enabled
    // 5 declensions; base-2 logarithm of 16 = 4
    for (let i = 0; i < Math.log2(16) + 1; i++) {
      // 2 to the power of i is i's binary counterpart
      // for example, if i was 3, bj = 8 = 0b01000
      let bj = 2 ** i;

      // If  1, 2, 4, 8, or 16 is found, then enable
      // declensions 1, 2, 3, 4, or 5, respectively
      if ((bj & this.options.declensions) === bj)
        enabledDeclensions[i] = declensions[i + 1];
    }

    return enabledDeclensions;
  }

  questionGenerators = {
    vocab,
    declensions,
  };
}
