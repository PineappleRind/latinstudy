import Message from "../components/Message.js";
import { $, $$, fetchToJSON } from "../utils.js";
import Formulator from "./Formulator.js";
import { QuizOptions } from "../types.js";

// Initializer fetches data and gets the user's settings.
export class Initializer {
  optEls: { [key: string]: any };
  options: QuizOptions;
  fetched: any;

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

  async initialize(data) {
    // first, deal with the user's settings
    this.settingsListen();
    // Then the data
    this.fetched = data;
  }

  settingsListen() {
    // Deal with selecting different declensions
    for (const opt of this.optEls.declensions) {
      opt.addEventListener("click", () => {
        opt.classList.toggle("selected");
        this.options.declensions ^= 0b00001 << (+opt.dataset.value - 1);
      });
    }

    // On click
    $(".pane-trigger.quiz-begin").addEventListener("click", () => {
      if (this.quizIsEmpty()) {
        new Message("No declensions and/or vocabulary question number specified.", 2, 4000);
        // a bit of a hacky way to override Switcher...
        return window.latinstudier.switcher.showPane("quiz-start");
      }
      this.options.immediateGrade = this.optEls.immediateGrade.checked;
      this.options.vocabNum = this.optEls.vocabNum.value;

      new Formulator(this.options).initialize(this.fetched[0], this.fetched[1]);
    });

    return this;
  }

  // If declension selection is empty AND vocab is set to off
  quizIsEmpty = () => 
    !this.options.declensions && !this.optEls.vocabNum.value
}
