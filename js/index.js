import { $, fetchToJSON, ord, createElement } from "./utils.js";

class Switcher {
  constructor() {
    this.panes = $(".pane", 1);
    this.triggers = $(".pane-trigger", 1);
    this.history = [];
    return this;
  }
  listen() {
    this.indexPanes();
    for (const trigger of this.triggers)
      trigger.addEventListener("click", () =>
        this.showPane(trigger.dataset.pane)
      );
    return this;
  }
  indexPanes() {
    let indexed = {};
    for (const pane of this.panes) indexed[pane.id] = pane;
    this.panes = indexed;
  }
  showPane(id) {
    let target = this.panes[id];
    if (id.startsWith(".")) target = this.history[1];
    if (!target) target = this.panes["404"];
    target.classList.add("showing");
    if (this.history[0]) this.history[0].classList.remove("showing");
    this.history.unshift(target);
    return this;
  }
}

const Quiz = {
  // Initializer fetches data, gets the user's settings, and
  // sends both to Begin using a callback.
  Initializer: class {
    constructor() {
      this.optEls = {
        declensions: $(".quiz-declension-option", 1),
        vocabNum: $(".quiz-vocab-count"),
      };
      this.options = {
        declensions: 0b00000,
        vocabNum: 0,
      };

      return this;
    }

    async initialize(c) {
      // first, deal with the user's settings
      this.settingsListen();
      // Then the data
      let declensions = await fetchToJSON("./data/declensions.json"),
        vocab = await fetchToJSON("./data/vocab.json");

      this.fetched = { declensions, vocab };
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
      return this;
    }
  },
  // Formulator handles the formulation of the questions based on
  // JSON data, and sends them to WalkthroughMan to start the quiz.
  Formulator: class {
    constructor() {
      this.questions = [];
    }

    initialize(declensions, vocab, options) {
      // Only get from the declensions enabled
      let getFrom = {};
      // For every declension enabled
      for (let j = 0; j < Math.log2(16) + 1; j++) {
        // 5 declensions; base-2 logarithm of 16 = 4
        let bj = 2 ** j; // 2 to the power of J is its binary counterpart

        // If  1, 2, 4, 8, or 16 is found, then enable
        // declensions 1, 2, 3, 4, or 5, respectively
        if ((bj & options.declensions) === bj) {
          getFrom[j] = declensions[j + 1];
        }
      }

      // TODO
      // this.questionGenerators.vocab(vocab, options.vocabNum);

      for (let declnum in getFrom)
        this.questions.push(
          ...this.questionGenerators.declensions.bind(this)(+declnum + 1, getFrom[declnum])
        );

      new Quiz.WalkthroughMan().initialize(this.questions);
    }

    questionGenerators = {
      // Unfinished
      vocab(vocab, num) {
        // For as many as the user wants,
        for (let i = 0; i < num; i++) {
          // get a random vocab word from the vocab JSON
          let r = vocab[Math.floor(Math.random() * vocab.length)];
          // then generate 1 of 3 vocab question types
          this.questions.push({
            type: "vocab",
            question: r.word,
            answer: r.translation,
          });
        }
      },

      declensions(
        declnum,
        data,
        cur,
        curType = 0,
        curQuestion,
        curGender,
        questions
      ) {
        questions ??= [];
        // Set current to the data
        if (!cur) cur = data;
        // For each key in the data
        for (const [k, v] of Object.entries(cur)) {
          // New gender? Set it
          if (curType === 0) curGender = k;
          // if it's on an ending
          onEnding: {
            if (curType === 2) {
              if (v === "-") break onEnding;
              curQuestion = {
                question: `Enter the ${ord(declnum)} declension`,
              };
              questions.push(curQuestion); // Next one!

              // finish the string
              curQuestion.question += ` ${k} ending (${curGender})`;
              // add the answer
              curQuestion.answer = v;
              // add HTML
              curQuestion.html = this.htmlGenerator(curQuestion);
              // apply changes
              questions[questions.length - 1] = curQuestion;
            }
          }

          // Not finished? Recurse
          if (v === Object(v))
            this.questionGenerators.declensions.bind(this)(
              declnum,
              data,
              v,
              curType + 1,
              curQuestion,
              curGender,
              questions
            );
        }
        // Finished? Return!
        return questions;
      },
    };

    htmlGenerator(questionData) {
      let title = createElement(
          "h3",
          "class:quiz-question-title",
          questionData.question
        ),
        input = createElement(
          "input",
          "placeholder:Enter...;type:text;class:quiz-question-input"
        ),
        container = createElement("div", "class:quiz-content-inner");
      input.correct = questionData.answer;

      container.append(title, input);
      return container;
    }
  },
  // WalkthroughMan handles the showing of the questions to the
  // user, records the user's response, and sends them to Grader.
  WalkthroughMan: class {
    constructor() {
      this.curQuestionIndex = -1;
      this.container = $(".quiz-content-outer");
      this.btns = {
        prev: $('.quiz-prev'),
        next: $('.quiz-next')
      }
    }

    initialize(questions) {
      this.questions = questions;
      this.container.append(this.questions[++this.curQuestionIndex].html);
      this.container.classList.remove("hidden");
      this.updatePrevBtn()
    }

    nextQuestion() {
      this.curQuestionIndex += 1;
      this.loadQuestion(this.curQuestionIndex);
    }

    prevQuestion() {
      this.curQuestionIndex -= 1;
      this.loadQuestion(this.curQuestionIndex);
    }

    loadQuestion(index) {
      if (!this.questions[index]) return;
      this.updatePrevBtn()
      this.container.classList.add("hidden");
      setTimeout((() => {
        if (this.container.children[0]) this.container.children[0].remove();

        this.container.append(this.questions[index].html);
        this.container.classList.remove("hidden");
      }).bind(this), 400);
    }

    updatePrevBtn() {
      if (this.curQuestionIndex === 0) this.btns.prev.classList.add('hidden');
      else this.btns.prev.classList.remove('hidden');
    }
  },
  // Grader recieves the responses from WalkthroughMan, compares
  // them to the questions, grades, and shows the grade to the user.
  Grader: class {},
};
let s = new Switcher(),
  qpb = new Quiz.Initializer(),
  qf = new Quiz.Formulator();

qpb.initialize();

$(".pane-trigger.quiz-begin").addEventListener("click", () => {
  qf.initialize(qpb.fetched.declensions, qpb.fetched.vocab, qpb.options);
});

s.listen().showPane("begin");
