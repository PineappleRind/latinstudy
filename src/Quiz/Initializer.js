import Message from "../components/Message.js";
import { $, fetchToJSON } from "../utils.js";
import Formulator from "./Formulator.js";

// Initializer fetches data and gets the user's settings.
export default class Initializer {
  constructor() {
    this.optEls = {
      declensions: $(".quiz-declension-option", 1),
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
      opt.addEventListener("click", (e) => {
        e.target.classList.toggle("selected");
        this.options.declensions ^= 0b00001 << (+e.target.dataset.value - 1);
      });
    }

    // On click
    $(".pane-trigger.quiz-begin").addEventListener("click", (e) => {
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

  quizIsEmpty = () => !this.options.declensions && (!this.optEls.vocabNum.value || this.optEls.vocabNum.value === "-1")
}
