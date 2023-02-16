
import Switcher from "./components/Switcher.js";
import { Initializer } from "./quiz/index.js";
import { Loader } from "./view/index.js";
import { DataHandler } from "./dataHandlers/index.js";

/**
 * Base Studier class.
 * Initializes all modules.
 */
export class Studier {
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
    this.switcher.listen().showPane("begin");
    this.viewLoader.initialize(this.data);
    this.quizInitializer.initialize(this.data);
  }
}

declare global {
  interface Window { latinstudier: Studier; }
}

window.latinstudier = new Studier();