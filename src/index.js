import Switcher from "./components/Switcher.js";
import Quiz from "./Quiz/index.js";
import View from "./view/index.js";
import { fetchToJSON } from "./utils.js";

class Studier {
  constructor() {
    this.switcher = new Switcher();
    this.dependents = [new Quiz.Initializer(), new View.Loader()];

    if (this.fetching) return this.fetching;

    let declensions = fetchToJSON("./data/declensions.json"),
      vocab = fetchToJSON("./data/vocab.json");

    Promise.all([declensions, vocab]).then((values) => {
      return this.initialize(values);
    });
  }
  initialize(data) {
    this.switcher.listen().showPane("begin");
    this.dependents.forEach(a => a.initialize(data));
  }
}



window.latinstudier = new Studier();