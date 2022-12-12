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

  async initialize() {
    // first, deal with the user's settings
    this.settingsListen();
    // Then the data
    let declensions = await fetchToJSON("./data/declensions.json"),
      vocab = await fetchToJSON("./data/vocab.json");

    Promise.all([declensions, vocab]).then((values) => {
      this.fetched = values;
    });
  }

  settingsListen() {
    // Deal with selecting different declensions
    for (const opt of Object.values(this.optEls.declensions)) {
      opt.addEventListener("click", (e) => {
        e.target.classList.toggle("selected");
        this.options.declensions ^= 0b00001 << (+e.target.dataset.value - 1);
      });
    }
    // Deal with entering different numbers of vocabulary
    this.optEls.vocabNum.addEventListener("input", (e) => {
      this.options.vocabNum = e.target.value;
    });

    // Immediate grade checkbox
    this.optEls.immediateGrade.addEventListener("input", (e) => {
      this.options.immediateGrade = e.target.checked;
    });

    // On click
    $(".pane-trigger.quiz-begin").addEventListener("click", (e) => {
      if (this.quizIsEmpty()) {
        alert("No declensions and/or vocabulary question number specified.");
        // a bit of a hacky way to override Switcher...
        return window.latinstudier.switcher.showPane("quiz-start");
      }
      new Formulator(this.options).initialize(this.fetched[0], this.fetched[1]);
    });

    return this;
  }

  quizIsEmpty = () => {
    !this.options.declensions && !this.options.vocabNum;
  };
}
