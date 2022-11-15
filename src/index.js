import Switcher from "./components/Switcher.js";
import Quiz from './Quiz/index.js';

let s = new Switcher();
s.listen().showPane("begin");

new Quiz.Initializer().initialize();