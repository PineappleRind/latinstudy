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

let container = createElement("div", "class:toast-container");

$("#app").append(container);

// Grader recieves the responses from WalkthroughMan, compares
// them to the questions, grades, and shows the grade to the user.

class Grader {
  constructor() { }
  initialize(userAnswers, questions) { }
  gradeQ(question, userAnswer) {
    // Empty input? Come on, User! :(
    if (!userAnswer) return false;
    // Remove accents to compare with correct answer
    userAnswer = purify(userAnswer);

    // If there are multiple answers
    if (question.answer.constructor === Array) {
      let correct = question.answer;
      let directEquals = correct.some(el=>purify(el) === purify(userAnswer)),
        fuzzyEquals = correct.some(el=>this.equals(el,userAnswer));

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
    // Correct? Return right
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
  equals(word1, word2) {
    word1 = purify(word1);
    word2 = purify(word2);

    if (word1 === word2)
      return true;

    let foundMistakes = 1; // only allow 1 character difference
    for (let i = 0; i < word1.length; i++) {
      if (word1.charAt(i) === word2.charAt(i)) continue;

      foundMistakes--;
      if (foundMistakes < 0) return false;
    }

    return true;
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
  }

  initialize(questions, options) {
    this.questions = shuffleArray(questions);
    this.options = options;

    //  1 = grade then next, 2 = next, 3 = finish
    this.timeTo = this.options.immediateGrade ? 1 : 2;

    // Load the first question
    this.loadQuestion(0, 0, 1).then(
      () => (this.defaultHeight = this.container.getBoundingClientRect().height)
    );
    this.updateDisable();

    this.btns.next.addEventListener("click", () => {
      console.log(this.timeTo);
      // ready to grade, if necessary
      if (this.timeTo === 1) {
        this.gradeQuestion();
        this.timeTo =
          this.curQuestionIndex === this.questions.length - 1 ? 3 : 2;
      }

      // done grading and expecting to go to the next question?
      else if (this.timeTo === 2) {
        this.toQuestion.apply(this, [1, this.questionTransition]);
        if (this.options.immediateGrade) this.timeTo = 1;
      }

      // finished grading and time to finish?
      else if (this.timeTo === 3) {
        return this.finishQuiz();
      }

      this.updateNextBtn();
    });
    this.btns.prev.addEventListener(
      "click",
      this.toQuestion.bind(this, -1, this.questionTransition)
    );
    // If grading after each question is enabled
    // change "Next" button to "Grade"
    if (this.options.immediateGrade) this.btns.next.innerHTML = "Grade";
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
    // Reset the height of the container
    let cor = 0;
    // if question is already graded add the height of the correct answer box
    if (
      Math.sign(n) < 0 &&
      this.options.immediateGrade &&
      this.questions[index].graded !== null
    )
      cor = 25.5;
    this.container.style.height = this.defaultHeight + cor + "px";
    // store some elements
    this.curInput = this.questions[index].html.querySelector("input");
    this.curInput.focus();
    this.updateDisable();

    // Hide the container's contents and prepare it for the next content
    this.container.classList.add("hidden");
    this.container.style.width
      = this.questions[index].html.querySelector('h3').style.width
      = `${this.getHTMLDimensions(this.questions[index].html, "width")}px`;

    return new Promise((resolve) => {
      // Wait a bit
      wait(delay).then(() => {
        // then replace the content and unhide
        if (this.container.children[0]) this.container.children[0].remove();
        this.container.append(this.questions[index].html);
        this.inputListen();
        this.container.classList.remove("hidden");
        resolve();
      });
    });
  }

  getHTMLDimensions(html, prop) {
    // Clone the node & measure it
    html.classList.add("invisible");
    document.body.append(html);
    let size = html.getBoundingClientRect()[prop];
    html.classList.remove("invisible");
    html.remove();
    return size;
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
    if (this.timeTo === 1) this.btns.next.innerHTML = "Grade";
    else if (this.timeTo === 2) this.btns.next.innerHTML = "Next";
    else if (this.timeTo === 3) this.btns.next.innerHTML = "Finish";
  }

  inputListen() {
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
  }

  gradeQuestion() {
    let cur = this.questions[this.curQuestionIndex];
    // if the question is already graded AND shown as graded,
    if (cur.graded && !this.options.immediateGrade) return;

    // get grade
    let userAnswer = this.userAnswers.map((m) => m.response)[
      this.curQuestionIndex
    ];
    let isCorrect = this.grader.gradeQ(
      cur,
      this.userAnswers.map((m) => m.response)[this.curQuestionIndex]
    );

    let typeofAnswer = ["wrong", "partial-correct", "correct"][isCorrect];
    console.log(typeofAnswer);
    function visualUpdate() {
      this.curInput.disabled = true;
      this.curInput.classList.add(typeofAnswer);
      // Measure the new height once the correct answer is added
      // for a lovely animation. 😍
      let correct = createElement("div", "class:quiz-correct-answer");
      correct.append(renderAnswer(cur.answer));
      let nh = this.getHTMLDimensions(correct, "height");
      this.container.style.height = this.defaultHeight + nh + "px";
      this.container.children[0].append(correct);
    }
    // only update visually if immediate grading was specified
    if (this.options.immediateGrade) visualUpdate.apply(this);

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
    console.log(this);
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
    let [gender, gnumber, $case] = type.split('|');

    if (ending === "-" || gender !== 'm') continue; // no ending? continue
    
    // format the question
    let formulation = {
      question: toQuestion(declnum, gender, gnumber, $case),
      answer: ending
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
    container = createElement("div", "class:quiz-content-inner");

  container.append(title, input);
  return container;
}

function toQuestion(declnum, gender, gnumber, $case) {
  return `${ord(declnum)} declension ${map[$case]} ${map[gnumber]} ending (${gender.split('').map(g=>map[g]).join('/')})`;
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
      `What does <b>${questionData.word}</b> mean?`
    ),
    input = createElement(
      "input",
      "placeholder:What's the translation? Enter...;type:text;class:quiz-question-input"
    ),
    container = createElement("div", "class:quiz-content-inner");

  container.append(title, input);
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
    for (const opt of Object.values(this.optEls.declensions)) {
      opt.addEventListener("click", (e) => {
        e.target.classList.toggle("selected");
        this.options.declensions ^= 0b00001 << (+e.target.dataset.value - 1);
      });
    }

    // On click
    $(".pane-trigger.quiz-begin").addEventListener("click", (e) => {
      if (this.quizIsEmpty()) {
        alert("No declensions and/or vocabulary question number specified.");
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
            for (const table of $('.view-decl-table', 1))
                table.style.display = (e.target.value === 'vocab' ? 'none' : 'table');
        };

        this.options.declType.oninput = (e) => {
            this.update[this.options.type.value](data);
        };
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
                $(
                    `.view-table-field.${map[gender]}.${map[gnumber]}.${map[$case]}`
                ).textContent = ending;

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
                $(
                    `.view-table-head:not(.${genders.join("):not(.")}), 
            .view-table-field:not(.${genders.join("):not(.")})`,
                    1
                )
            ).forEach((e) => (e.style.display = "none"));
        },
        vocab: ([_declensions, vocab]) => {
            if (this.vocabLoaded === true) return;
            for (const voc of vocab) {
                let word = createElement('div', 'class:view-vocab-word', `${voc.word}${voc.genitive ? ', ' + voc.genitive : ''}`);
                word.append(renderAnswer(voc.translation));
                $('.view-vocab').append(
                    word
                );
            }
            this.vocabLoaded = true;
        }
    };
}

var View = { Loader };

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
