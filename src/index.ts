
import Switcher from "./components/Switcher.js";
import { Initializer } from "./quiz/index.js";
import { Loader } from "./view/index.js";
import { fetchToJSON } from "./utils.js";
import DataHandler from "./dataHandlers/index.js";

class Studier {
  switcher: Switcher;
  quizInitializer: Initializer;
  viewLoader: Loader;
  data: object; // have type for this later

  constructor() {
    this.switcher = new Switcher();

    this.quizInitializer = new Initializer();
    this.viewLoader = new Loader();

    this.initialize();
  }
  async initialize() {
    this.data = (await new DataHandler().initialize()).parse();
    console.log(this.data)
    this.switcher.listen().showPane("begin");
    this.viewLoader.initialize(this.data);
    this.quizInitializer.initialize(this.data);
  }
}

declare global {
  interface Window { latinstudier: Studier; }
}

window.latinstudier = new Studier();