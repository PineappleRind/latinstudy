import { WalkthroughMan } from "./WalkthroughMan.js";
import { QuizOptions, QuizQuestion } from "./types.js";

import { 
  formulateDeclensionQuestion as declensions, 
  formulateVocabQuestion as vocab 
} from './formulators/index.js';

import { ParsedEndingsData, VocabWord } from "../dataHandlers/parse/types.js";
/**
 * Handles the formulation of the questions based on JSON data, and sends them to WalkthroughMan to start the quiz.
 * */
export class Formulator {
  options: QuizOptions;
  /** Finished QuizQuestion formulations. */
  questions: QuizQuestion[];

  constructor(options: QuizOptions) {
    this.options = options;
    this.questions = [];
  }
  questionFormulators = { declensions, vocab };
  /**
   * Generate questions and initialize WalkthroughMan with them.
   * @param endings JSONResource containing arrays of conjugations, declensions, and personal pronouns. There should be a type for this!
   * @param vocab JSONResource containing an array of all vocab words.
   */
  initialize(endings: ParsedEndingsData, vocab: VocabWord[]): void {
    this.generateQuestions(endings, vocab);
    new WalkthroughMan().initialize(this.questions, this.options);
  }
  /**
   * Requests all necessary questions to be generated by the formulators.
   * Same parameters as {@link Formulator.initialize}
   * @returns a list of quesitons.
   */
  generateQuestions(endings: ParsedEndingsData, vocab: VocabWord[]) {
    // Only get from the declensions enabled
    const enabledDeclensions = this.enabledDeclensions(endings.declensions);

    this.questions.push(
      ...this.questionFormulators.vocab(vocab, this.options.vocabNum)
    );

    for (const declnum in enabledDeclensions)
      this.questions.push(
        ...this.questionFormulators.declensions.bind(this)(
          +declnum + 1,
          enabledDeclensions[declnum]
        )
      );
  }
  /**
   * @param declensions Object of declension endings (includes 1, 2, 3, 4, and 5).
   * @returns Object of declension endings — only includes what the user selected, if any.
   */
  enabledDeclensions(declensions) {
    const enabledDeclensions = {};
    // For every declension enabled
    // 5 declensions; base-2 logarithm of 16 = 4
    for (let i = 0; i < Math.log2(16) + 1; i++) {
      // 2 to the power of i is i's binary counterpart
      // for example, if i was 3, bj = 8 = 0b01000
      const bj = 2 ** i;

      // If  1, 2, 4, 8, or 16 is found, then enable
      // declensions 1, 2, 3, 4, or 5, respectively
      if ((bj & this.options.declensions) === bj)
        enabledDeclensions[i] = declensions[i + 1];
    }

    return enabledDeclensions;
  }
}
