const $ = (s, a) => document[`querySelector${a ? "All" : ""}`](s);

const fetchToJSON = async (url) => {
  let data = await fetch(url).then((r) => r.json());
  return data;
};

// https://stackoverflow.com/a/57518703
const ord = (n) =>
  n +
  { e: "st", o: "nd", w: "rd", h: "th" }[
  new Intl.PluralRules("en", { type: "ordinal" }).select(n)[2]
  ];

const createElement = (tag, attrs, value) => {
  // shorthand element function
  let el = document.createElement(tag);
  if (attrs)
    attrs.split(";").forEach((attr) => {
      if (!attr) return;
      let vals = attr.split(":");
      el.setAttribute(vals[0].trim(), vals[1].trim());
    });
  el.innerHTML = value || "";
  return el;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const purify = (str) =>
  str
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("æ", "ae")
    .toLowerCase();

//https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function renderAnswer(str) {
  let res = createElement("span", "class:rendered-answer");
  const process = (str, answer, i) => {
    let broken = answer.split("|");
    let word = broken[0],
      note = broken[1];

    res.append(word);
    if (note)
      res.append(createElement("span", "class:answer-note", `(${note})`));

    if (i !== (str ?? answer).length - 1) res.append(", ");
  };

  if (str.constructor === Array) str.forEach((a, i) => process(str, a, i));
  else process("", str, -1);

  return res;
}

const map = {
  "n": "neuter",
  "m": "masculine",
  "f": "feminine",
  "s": "singular",
  "p": "plural",
  "nom": "nominative",
  "gen": "genitive",
  "dat": "dative",
  "acc": "accusative",
  "abl": "ablative",
};

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

let typeMap = ["info", "success", "error"],
  queue = [],
  showing = false,
  id = 0,
  container = createElement("div", "class:toast-container");

$("#app").append(container);

class Message {
  constructor(content, type, duration, title) {
    // Create a message
    let el = createElement("div", `class:toast ${typeMap[type]}`);
    if (title) el.append(createElement("h3", "class:toast-header", title));
    el.append(
      createElement(
        "p",
        `class:toast-description ${title ? "smaller" : ""}`,
        content
      )
    );

    this.el = el;
    this.duration = duration;
    this.id = (id++).toString(16);
    // Add it to the queue
    queue.push(this);
    // Call the manager 😡
    wantToShow(this.id);
  }
}

function wantToShow() {
  if (!queue.length) return;
  if (showing) return setTimeout(wantToShow, queue[0].duration)
  showMessage(queue[0]).then(() => {
    queue.shift();
    showing = false;
    wantToShow();
  });
}

function showMessage({ el, duration }) {
  return new Promise(async (r) => {
    container.append(el);
    showing = true;
    await wait(duration);
    el.classList.add("hidden");
    wait(200).then(() => {
      el.remove();
      r();
    });
  });
}

// Grader recieves the responses from WalkthroughMan, compares
// them to the questions, grades, and shows the grade to the user.

class Grader {
  constructor() { }
  initialize(userAnswers, questions) { }
  gradeQuestion(question, userAnswer) {
    if (!userAnswer) return false;
    // Remove accents to compare with correct answer
    userAnswer = purify(userAnswer);
    // If there are multiple answers
    if (question.answer.constructor === Array) {
      let correct = question.answer;
      let directEquals = correct.some(el => purify(el) === userAnswer),
        fuzzyEquals = correct.some(el => this.equals(userAnswer, el));

      if (directEquals) return 2;
      else if (fuzzyEquals) return 1;
      else return 0;
    }
    // if there's only 1 answer
    else {
      let directEquals = userAnswer === purify(question.answer),
        fuzzyEquals = this.equals(userAnswer, question.answer);
      if (directEquals) return 2;
      else if (fuzzyEquals) return 1;
      else return 0;
    }
  }

  equals(word1, correct) {
    word1 = purify(word1);
    correct = purify(correct);

    if (word1 === correct)
      return true;
    // if the word is really short, we can't tell if the user
    // actually made a typo but got it correct- so mark wrong
    else if (correct < 2) return false;

    let foundMistakes = 1; // only allow 1 character difference
    for (let i = 0; i < word1.length; i++) {
      if (word1.charAt(i) === correct.charAt(i)) continue;

      foundMistakes--;
      if (foundMistakes < 0) return false;
    }

    return true;
  }

  finish(questions) {
    console.log(questions);
    // switch to results pane
    window.latinstudier.switcher.showPane("quiz-results");
    let numCorrect = 0;
    $('#quiz-results-questions-inner').innerHTML = '';
    for (let [i, question] of questions.entries()) {
      let qSum = createElement(
        "div",
        "class:quiz-results-q",
        `${i + 1}. ${question.question}: `
      ),
        qWrong = createElement(
          "span",
          "class:quiz-results-q-wrong",
          question.graded.userAnswer
        ),
        qCorrect = createElement("span", "class:quiz-results-q-correct");

      qCorrect.append(renderAnswer(question.answer));

      if (question.graded.isCorrect > 0) numCorrect++;
      else qSum.append(qWrong);
      qSum.append(qCorrect);
      $("#quiz-results-questions-inner").append(qSum);
    }

    $("#quiz-results-percentage").textContent =
      Math.round((numCorrect / questions.length) * 1000) / 10;
    $("#quiz-results-num-correct").textContent = numCorrect;
    $("#quiz-results-total").textContent = questions.length;
  }
}

class Animator {
  constructor(target, settings) {
    this.outer = target; // outer
    this.settings = settings;

    let possibleInner = this.outer.querySelector('.animator-inner');
    if (possibleInner) possibleInner.remove();

    this.inner = createElement("div", "class:animator-inner");
    this.outer.append(this.inner);
  }
  animateTo(html, delay) {
    // get dimensions
    let dimensions = this.getHTMLDimensions(html);
    // Hide the container's contents and prepare it for the next content
    this.outer.classList.add("hidden");
    this.outer.style.width = `${Math.max(dimensions.width, this.settings.minWidth || 0)}px`;
    this.outer.style.height = `${dimensions.height}px`;

    return new Promise((resolve) => {
      // Wait a bit
      wait(delay).then(() => {
        // then replace the content and unhide
        this.outer.replaceChild(html, this.inner);
        this.outer.classList.remove("hidden");
        // save current inner
        this.inner = html;
        resolve(html);
      });
    });
  }

  animateAppend(toappend, delay) {
    // create a clone and add the element
    let clone = this.inner.cloneNode(true);
    clone.append(toappend);
    // get hypothetical dimensions and update outer
    let dimensions = this.getHTMLDimensions(clone);
    this.outer.style.width = `${dimensions.width}px`;
    this.outer.style.height = `${dimensions.height}px`;
    // append the content
    this.inner.append(toappend);
  }

  getHTMLDimensions(html) {
    // Clone the node & measure it
    html.classList.add("invisible");
    document.body.append(html);
    let size = html.getBoundingClientRect();
    html.classList.remove("invisible");
    html.remove();
    return size;
  }
}

// WalkthroughMan handles the showing of the questions to the
// user, records the user's response, and sends them to Grader.

class WalkthroughMan {
  constructor() {
    // when walkthroughMan is initialized, load question 0
    this.curQuestionIndex = 0;
    this.container = $(".quiz-content-outer");
    this.btns = {
      prev: $(".quiz-prev"),
      next: $(".quiz-next"),
    };
    this.userAnswers = [];
    this.questionTransition = 200; // ms
    this.grader = new Grader();
    this.animator = new Animator(this.container, {
      minWidth: 300
    });
  }

  initialize(questions, options) {
    this.questions = shuffleArray(questions);
    this.options = options;

    //  1 = grade then next, 2 = next, 3 = finish
    this.timeTo = this.options.immediateGrade ? 1 : 2;

    // If grading after each question is enabled
    // change "Next" button to "Grade"
    if (this.options.immediateGrade) this.btns.next.innerHTML = "Grade";

    // update current question indicator
    $("#count-total").textContent = this.questions.length;
    $("#count-current").textContent = "1";

    // Load the first question
    this.loadQuestion(0, 0, 1).then(
      () => (this.defaultHeight = this.container.getBoundingClientRect().height)
    );
    this.updateDisable();

    this.btns.next.addEventListener("click", this.listen.next.bind(this));
    this.btns.prev.addEventListener("click", this.listen.prev.bind(this));
  }

  toQuestion(n) {
    if (this.options.immediateGrade) this.btns.next.innerHTML = "Grade";
    this.curQuestionIndex += n;
    this.loadQuestion(this.curQuestionIndex, this.questionTransition, n);
  }

  loadQuestion(index, delay, n) {
    if (!this.questions[index]) {
      this.curQuestionIndex -= n;
      return this.finishQuiz();
    }

    // update the question indicator
    $("#count-current").textContent = (index + 1).toString();

    // if question is already graded make sure the button says Next and not Grade
    if (this.questions[index].graded) this.timeTo = 2;
    this.updateNextBtn();

    this.curInput = this.questions[index].html.querySelector("input");
    this.updateDisable();

    return new Promise(async (resolve) => {
      await this.animator.animateTo(this.questions[index].html, delay);
      this.listen.input();
      resolve();
    });
  }

  updateDisable() {
    // disable the previous button if needed
    if (this.curQuestionIndex === 0) this.btns.prev.disabled = true;
    else this.btns.prev.disabled = false;
    // no input? disable next button
    if (
      !this.curInput?.value.replaceAll(" ", "") &&
      !this.questions[this.curQuestionIndex].graded
    )
      this.btns.next.disabled = true;
    else this.btns.next.disabled = false;
  }

  updateNextBtn() {
    let map = ["Grade", "Next", "Finish"];
    this.btns.next.innerHTML = map[this.timeTo - 1];
  }

  listen = {
    next: () => {
      // time to grade
      if (this.timeTo === 1) {
        this.gradeQuestion();
        this.timeTo =
          this.curQuestionIndex === this.questions.length - 1 ? 3 : 2;
      }

      // done grading and expecting to go to the next question?
      else if (this.timeTo === 2) {
        // grade if the user has disabled immediate grading and it didn't grade before
        if (!this.options.immediateGrade) this.gradeQuestion();
        // next question
        this.toQuestion.apply(this, [1, this.questionTransition]);
        if (this.options.immediateGrade) this.timeTo = 1;
      }

      // finished grading and time to finish?
      else if (this.timeTo === 3) return this.finishQuiz();

      this.updateNextBtn();
    },
    prev: () => {
      this.toQuestion.apply(this, [-1, this.questionTransition]);
    },
    input: () => {
      onkeyup = (e) => {
        if (e.key === "Enter") return this.btns.next.click();
      };
      this.curInput.onkeyup = (e) => {
        this.updateDisable();
        this.userAnswers[this.curQuestionIndex] = {
          response: this.curInput.value,
          graded: null,
        };
      };
    },
  };

  updateGrade(isCorrect, answer) {
    // get the result
    let typeofAnswer = ["wrong", "partial-correct", "correct"][isCorrect];

    this.curInput.disabled = true;
    this.curInput.classList.add(typeofAnswer);
    // add correct answer
    let correct = createElement("div", "class:quiz-correct-answer");
    correct.append(renderAnswer(answer));
    // Measure the new height once the correct answer is added
    // for a lovely animation. 😍
    this.animator.animateAppend(correct, 200);
  }

  gradeQuestion() {
    let cur = this.questions[this.curQuestionIndex];
    // if the question is already graded AND shown as graded,
    if (cur.graded && !this.options.immediateGrade) return;

    // get grade
    let userAnswer = this.userAnswers.map((m) => m.response)[
      this.curQuestionIndex
    ];
    let isCorrect = this.grader.gradeQuestion(
      cur,
      this.userAnswers.map((m) => m.response)[this.curQuestionIndex]
    );

    // only update visually if immediate grading was specified
    if (this.options.immediateGrade) this.updateGrade(isCorrect, cur.answer);

    // Finally set the current question to graded
    this.questions[this.curQuestionIndex].graded = {
      isCorrect,
      answer: cur.answer,
      userAnswer,
    };
    // and update the buttons
    this.updateDisable();
  }

  finishQuiz() {
    this.grader.finish(this.questions);

    // reset
    this.questions = [];
    this.timeTo = 1;
    this.userAnswers = [];
    this.grader = new Grader();
  }
}

function declensions(declnum, endings) {
  let questions = [];
  for (const [type, ending] of Object.entries(endings)) {
    // split the key into its information components
    let [gender, gnumber, $case] = type.split("|");

    if (ending === "-") continue; // no ending? continue

    // format the question
    let formulation = {
      question: toQuestion(declnum, gender, gnumber, $case),
      answer: ending,
    };
    // add the answer & html
    formulation.html = generateDeclHTML(formulation);
    // apply changes
    questions.push(formulation);
  }
  // Finished? Return!
  return questions;
}

function generateDeclHTML(questionData) {
  let title = createElement(
      "h3",
      "class:quiz-question-title",
      questionData.question
    ),
    input = createElement(
      "input",
      "placeholder:What is it? Enter...;type:text;class:quiz-question-input"
    ),
    header = createElement("h4", "class:quiz-question-super", `what's the ending?`), 
    container = createElement("div", "class:animator-inner");

  container.append(header,title, input);
  return container;
}

function toQuestion(declnum, gender, gnumber, $case) {
  let genders = gender
    .split("")
    .map((g) => map[g])
    .join("/");
  return `${ord(declnum)} declension ${map[$case]} ${
    map[gnumber]
  } (${genders})`;
}

function vocab(vocab, num) {
  let result = [];
  num = +num;

  if (num === 0) num = vocab.length;
  else if (num === -1) num = 0;
  // shuffle
  shuffleArray(vocab);
  // For as many as the user wants,
  for (let i = 0; i < num; i++) {
    // get a random vocab word from the vocab JSON
    let r = vocab[i];
    // then generate 1 of 3 vocab question types
    result.push({
      type: "vocab",
      question: r.word,
      answer: r.translation,
      html: generateVocabHTML(r),
    });
  }
  return result;
}

function generateVocabHTML(questionData) {
  let title = createElement(
      "h3",
      "class:quiz-question-title",
      `${questionData.word}${questionData.dictionary ? ", " + questionData.dictionary : ""}`
    ),
    input = createElement(
      "input",
      "placeholder:What's the translation? Enter...;type:text;class:quiz-question-input"
    ),
    header = createElement("h4", "class:quiz-question-super", `translate the ${questionData.type}`),
    container = createElement("div", "class:animator-inner");

  container.append(header, title, input);
  return container;
}

// Formulator handles the formulation of the questions based on
// JSON data, and sends them to WalkthroughMan to start the quiz.

class Formulator {
  constructor(options) {
    this.options = options;
    this.questions = [];
  }

  initialize(declensions, vocab) {
    // Only get from the declensions enabled
    let getFrom = {};
    console.log(this.options.declensions);
    // For every declension enabled
    for (let j = 0; j < Math.log2(16) + 1; j++) {
      // 5 declensions; base-2 logarithm of 16 = 4
      let bj = 2 ** j; // 2 to the power of J is its binary counterpart

      // If  1, 2, 4, 8, or 16 is found, then enable
      // declensions 1, 2, 3, 4, or 5, respectively
      if ((bj & this.options.declensions) === bj)
        getFrom[j] = declensions[j + 1];
    }

    this.questions.push(
      ...this.questionGenerators.vocab(vocab, this.options.vocabNum)
    );

    for (let declnum in getFrom)
      this.questions.push(
        ...this.questionGenerators.declensions.bind(this)(
          +declnum + 1,
          getFrom[declnum]
        )
      );

    new WalkthroughMan().initialize(this.questions, this.options);
  }

  questionGenerators = {
    vocab,
    declensions,
  };
}

// Initializer fetches data and gets the user's settings.
class Initializer {
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

  async initialize(data) {
    // first, deal with the user's settings
    this.settingsListen();
    // Then the data
    this.fetched = data;
  }

  settingsListen() {
    // Deal with selecting different declensions
    for (const opt of this.optEls.declensions) {
      opt.addEventListener("click", (e) => {
        e.target.classList.toggle("selected");
        this.options.declensions ^= 0b00001 << (+e.target.dataset.value - 1);
      });
    }

    // On click
    $(".pane-trigger.quiz-begin").addEventListener("click", (e) => {
      if (this.quizIsEmpty()) {
        new Message("No declensions and/or vocabulary question number specified.", 2, 4000);
        // a bit of a hacky way to override Switcher...
        return window.latinstudier.switcher.showPane("quiz-start");
      }
      this.options.immediateGrade = this.optEls.immediateGrade.checked;
      this.options.vocabNum = this.optEls.vocabNum.value;

      new Formulator(this.options).initialize(this.fetched[0], this.fetched[1]);
    });

    return this;
  }

  quizIsEmpty = () => !this.options.declensions && (!this.optEls.vocabNum.value || this.optEls.vocabNum.value === "-1")
}

var Quiz = {
  Initializer,
  Formulator,
  WalkthroughMan,
  Grader,
};

class Loader {
    constructor() {
        this.pane = $(".pane#view");
        this.options = {
            type: $("#view-type"),
            declType: $("#view-declension-type"),
        };
        this.vocabLoaded = false;
    }

    async initialize(data) {
        // listen for view button clicks
        $("#view-trigger").onclick = (e) =>
            this.update[this.options.type.value].apply(this, [data]);
        // listen for changes in select menues
        this.options.type.oninput = (e) => {
            this.options.declType.classList.toggle("hidden");
            this.update[e.target.value](data);
            $('.view-decl').style.display = (e.target.value === 'vocab' ? 'none' : 'block');
            $('.view-vocab').style.display = (e.target.value !== 'vocab' ? 'none' : 'block');
        };

        this.options.declType.oninput = (e) => {
            this.update[this.options.type.value](data);
        };

       // this.options.vocabSort.oninput = e => this.vocabSort(e.target.value);
    }

    update = {
        declensions: ([declensions]) => {
            let cur = declensions[this.options.declType.value];
            let genders = new Set();
            for (const [key, ending] of Object.entries(cur)) {
                let [gender, gnumber, $case] = key.split("|");
                if (key === "note") {
                    $("#view-note").innerHTML = ending;
                    continue;
                }
                $(`.view-table-field.${map[gender]}.${map[gnumber]}.${map[$case]}`).textContent = ending;

                genders.add(gender);
            }
            // expand all contractions
            genders = Array.from(genders).map((n) => map[n]);
            // show every gender
            Array.from($(`.view-table-head, .view-table-field`, 1)).forEach(
                (e) => (e.style.display = "table-cell")
            );
            // hide every gender that isn't part of the declension
            Array.from(
                $(`.view-table-head:not(.${genders.join("):not(.")}), 
                    .view-table-field:not(.${genders.join("):not(.")})`, 1)
            ).forEach((e) => (e.style.display = "none"));
        },
        vocab: ([_declensions, vocab]) => {
            if (this.vocabLoaded === true) return;
            for (const voc of vocab) {
                let word = createElement('div', 'class:view-vocab-word', `${voc.word}${voc.dictionary ? ', ' + voc.dictionary : ''}`);
                word.dataset.declension = voc.declension || "0";
                word.dataset.type = voc.type || "other";
                word.append(renderAnswer(voc.translation));

                $('.view-vocab').append(word);
            }
        //    this.vocabSort('type');
            this.vocabLoaded = true;
        }
    };

    //vocabSort(by) {
      //  let words = $()
    //}
}

var View = { Loader };

class Studier {
  constructor() {
    this.switcher = new Switcher();
    this.loaders = [new Quiz.Initializer(), new View.Loader()];

    let declensions = fetchToJSON("./data/declensions.json"),
      vocab = fetchToJSON("./data/vocab.json");

    Promise.all([declensions, vocab]).then((values) => {
      return this.initialize(values);
    });
  }
  initialize(data) {
    this.switcher.listen().showPane("begin");
    this.loaders.forEach(a => a.initialize(data));
  }
}



window.latinstudier = new Studier();
