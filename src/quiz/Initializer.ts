import Message from "../components/Message.js";
import { $, $$ } from "../utils.js";
import { Formulator } from "./Formulator.js";
import { QuizOptions } from "./types.js";

/**
 * Fetches data and gets the user's selected settings.
 * @category Quiz
*/ 
export class Initializer {
  optEls: { [key: string]: any };
  options: QuizOptions;
  data: any;

  constructor() {
    this.optEls = {
      declensions: $$(".quiz-declension-option"),
      vocabNum: $(".quiz-vocab-count"),
      immediateGrade: $("#quiz-immediate-grade"),
    };
    this.options = {
      declensions: 0b00000,
      vocabNum: 0,
      immediateGrade: true,
    };

    return this;
  }
  /**
   * It isn't necessary to pass the data straight through Initializer 
   * when you can just instantiate {@link Formulator} from {@link Studier}!
   * But that's complicated and will require awaits and stuff. I haven't figured it out.
   * @param data JSON data from {@link DataHandler}. 
   */
  async initialize(data) {
    this.data = data;
    this.watchSettings();
  }
  /**
   * Sets up event handlers for the quiz-begin pane.
   * @returns Initializer
   */
  watchSettings() {
    // Deal with selecting different declensions
    for (const opt of this.optEls.declensions) {
      opt.addEventListener("click", () => {
        opt.classList.toggle("selected");
        this.options.declensions ^= 0b00001 << (+opt.dataset.value - 1);
      });
    }

    $(".pane-trigger.quiz-begin").addEventListener("click", this.beginQuiz.bind(this));

    return this;
  }
  /**
   * Event handler for the .quiz-begin button. Sends options to Formulator.
   */
  beginQuiz() {
    if (this.quizIsEmpty()) {
      new Message("No declensions and/or vocabulary question number specified.", 2, 4000);
      // a bit of a hacky way to override Switcher.
      // since Switcher already switched BEFORE beginQuiz is called,
      // we have to switch back.
      window.latinstudier.switcher.showPane("quiz-start");
      return;
    }
    // get settings
    this.options.immediateGrade = this.optEls.immediateGrade.checked;
    this.options.vocabNum = this.optEls.vocabNum.value;

    new Formulator(this.options).initialize(this.data[0], this.data[1]);
  }
  
  /**
   * @returns true if declension selection is empty AND vocab is set to off 
   * */ 
  quizIsEmpty = (): boolean => 
    !this.options.declensions && !this.optEls.vocabNum.value
}
