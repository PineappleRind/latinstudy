import Switcher from "./components/Switcher.js";
import Quiz from './Quiz/index.js';

class Studier {
    constructor() {
        this.switcher = new Switcher();
        this.quizInitializer = new Quiz.Initializer();
    }
    initialize() {
        this.switcher.listen().showPane("begin");
        this.quizInitializer.initialize();
    }
}

window.latinstudier = new Studier();
latinstudier.initialize();