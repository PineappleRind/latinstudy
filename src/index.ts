
import Switcher from "./components/Switcher.js";
import { Initializer } from "./quiz";
import { Loader } from "./view/index.js";
import { fetchToJSON } from "./utils.js";

export class Studier {
  switcher: Switcher;
  quizInitializer: Initializer;
  viewLoader: Loader;

  constructor() {
    this.switcher = new Switcher();

    this.quizInitializer = new Initializer();
    this.viewLoader = new Loader();

    let endings = fetchToJSON("./data/endings.json"),
      vocab = fetchToJSON("./data/vocab.json");

    Promise.all([endings, vocab]).then((values) => {
      return this.initialize(values);
    });
  }
  initialize(data) {
    this.switcher.listen().showPane("begin");
    this.viewLoader.initialize(data);
    this.quizInitializer.initialize(data);
  }
}

declare global {
  interface Window { latinstudier: Studier; }
}

window.latinstudier = new Studier();