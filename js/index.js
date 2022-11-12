import { $, fetchToJSON, ord, createElement, wait } from "./utils.js";
import Switcher from "./Switcher.js";
import Quiz from './Quiz/index.js';

let s = new Switcher(),
  qpb = new Quiz.Initializer(),
  qf = new Quiz.Formulator();

qpb.initialize();

$(".pane-trigger.quiz-begin").addEventListener("click", () => {
  qf.initialize(qpb.fetched.declensions, qpb.fetched.vocab, qpb.options);
});

s.listen().showPane("begin");
