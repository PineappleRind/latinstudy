import Switcher from "./components/Switcher.js";
import Quiz from "./quiz/index";
import View from "./view/index";
import { fetchToJSON } from "./utils.js";
class Studier {
    constructor() {
        this.switcher = new Switcher();
        this.quizInitializer = new Quiz.Initializer();
        this.viewLoader = new View.Loader();
        let endings = fetchToJSON("./data/endings.json"), vocab = fetchToJSON("./data/vocab.json");
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
window.latinstudier = new Studier();
