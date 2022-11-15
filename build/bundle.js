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

const purify = str => str.trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace('æ', 'ae');

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

let typeMap = ['info', 'success', 'error'],
    queue = [],
    id = 0,
    container = createElement('div', 'class:toast-container');

$('#app').append(container);

class Message {
    constructor(content, type, duration, title) {
        // Create a message
        let el = createElement('div', `class:toast ${typeMap[type]}`);
        if (title) el.append(createElement('h3', 'class:toast-header', title));
        el.append(createElement('p', `class:toast-description ${title ? 'smaller' : ''}`, content));

        this.el = el,
            this.duration = duration,
            this.id = (id++).toString(16);
        // Add it to the queue
        queue.push(this);
        // Call the manager 😡
        wantToShow(this.id);
    }
}
function wantToShow() {
    if (!queue.length) return;

    showMessage(queue[0]).then(() => {
        queue.shift();
        console.log(queue);
        wantToShow();
    });
}

function showMessage({ el, duration }) {
    return new Promise(async r => {
        container.append(el);
        await wait(duration);
        el.classList.add('hidden');
        wait(200).then(() => {
            el.remove();
            r();
        });
    })
}

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
        // Get correct answer and normalize that too
        let correct = purify(question.answer);
        // Isn't correct? Return wrong
        if (userAnswer !== correct) return false;
        // Correct? Return right
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
            next: $(".quiz-next")
        };
        this.userAnswers = [];
        this.questionTransition = 200; // ms
        this.grader = new Grader();
    }

    initialize(questions) {
        this.questions = questions;
        this.loadQuestion(0, 0, 1)
            .then(() => {
                this.defaultHeight = this.container.getBoundingClientRect().height;
            });
        this.updateBtns();

        this.btns.next.addEventListener(
            "click",
            this.toQuestion.bind(this, 1, this.questionTransition)
        );
        this.btns.prev.addEventListener(
            "click",
            this.toQuestion.bind(this, -1, this.questionTransition)
        );
    }

    toQuestion(n, d) {
        this.curQuestionIndex += n;
        this.loadQuestion(
            this.curQuestionIndex,
            this.questionTransition,
            n
        );
    }

    loadQuestion(index, delay, n) {
        if (!this.questions[index]) {
            this.curQuestionIndex -= n;
            return this.finishQuiz();
        }
        // Reset the height of the container
        this.container.style.height = this.defaultHeight + 'px';
        // store some elements
        this.curInput = this.questions[index].html.querySelector("input");
        this.btns.curGrade = this.questions[index].html.querySelector('.quiz-grade');
        // add event listener to grade button
        this.btns.curGrade.addEventListener('click', this.showPreliminaryGrade.bind(this));
        this.updateBtns();
        
        this.container.classList.add("hidden");
        this.container.style.width = `${this.getHTMLDimensions(
            this.questions[index].html,
            "width"
        )}px`;

        return new Promise(resolve => {
            wait(delay).then(() => {
                if (this.container.children[0]) this.container.children[0].remove();
                this.container.append(this.questions[index].html);
                this.inputListen();
                this.container.classList.remove("hidden");

                resolve();
            });
        })
    }

    getHTMLDimensions(html, prop) {
        html.classList.add('invisible');
        document.body.append(html);
        let size = html.getBoundingClientRect()[prop];
        html.classList.remove('invisible');
        html.remove();
        return size;
    }

    updateBtns() {
        if (this.curQuestionIndex === 0) this.btns.prev.disabled = true;
        else this.btns.prev.disabled = false;

        if (!this.curInput?.value.replaceAll(" ", ""))
            this.btns.next.disabled = true;
        else this.btns.next.disabled = false;
    }

    inputListen() {
        this.curInput.onkeyup = (e) => {
            this.updateBtns();
            this.userAnswers[this.curQuestionIndex] = {
                response: this.curInput.value,
                graded: false,
            };
        };
    }

    showPreliminaryGrade() {
        let cur = this.questions[this.curQuestionIndex];
        if (cur.graded) return;
        // Disable the input
        this.curInput.disabled = true;
        // Check if user is correct or wrong
        let grade = this.grader.gradeQ(cur, this.userAnswers.map(m => m.response)[this.curQuestionIndex]);
        // Add class to input depending on grade
        this.curInput.classList.add(grade ? 'correct' : 'wrong');
        // Now measure the new height once the correct answer is added
        let correct = createElement('div', 'class:quiz-correct-answer', cur.answer);
        let nh = this.getHTMLDimensions(correct, 'height');
        this.container.style.height = this.defaultHeight + nh + 'px';
        this.container.children[0].append(correct);
        // Finally set the current question to graded
        this.questions[this.curQuestionIndex].graded = true;
    }

    finishQuiz() {
        this.grader.finish(this.userAnswers, this.questions);
    }
}

// Formulator handles the formulation of the questions based on
// JSON data, and sends them to WalkthroughMan to start the quiz.

class Formulator {
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
                ...this.questionGenerators.declensions.bind(this)(
                    +declnum + 1,
                    getFrom[declnum]
                )
            );

        new WalkthroughMan().initialize(this.questions);
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

        declensions(declnum, data, dataLevel = 0, formulation, cur = {}, questions) {
            // start off
            questions ??= [];
            cur.level ||= data;
            // For each key in the current level
            for (const [key, value] of Object.entries(cur.level)) {
                // New gender? Set it
                if (dataLevel === 0) cur.gender = key;
                // New grammatical number? Set it
                if (dataLevel === 1) cur.gnumber = key;
                // if it's on an ending
                if (dataLevel === 2) {
                    if (value === "-") break;

                    // list formatter (e.g. "one, two, or three")
                    let formatter = new Intl.ListFormat("en", {
                        style: "long",
                        type: "disjunction",
                    });
                    // format the question
                    formulation = {
                        question: `${ord(declnum)} declension ${cur.gnumber} ${formatter.format(cur.gender.split("/").map(this.expandGender))} ${key} ending`,
                    };
                    // add the answer
                    formulation.answer = value;
                    // add HTML
                    formulation.html = this.htmlGenerator(formulation);
                    // apply changes
                    questions.push(formulation);
                }

                // Not finished? Recurse
                if (value === Object(value)) {
                    cur.level = value;
                    this.questionGenerators.declensions.bind(this)(declnum, data, dataLevel + 1, formulation, cur, questions);
                }
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
            grader = createElement('div', 'class:quiz-grade', 'Grade'),
            container = createElement("div", "class:quiz-content-inner");
        input.correct = questionData.answer;

        container.append(title, input, grader);
        return container;
    }
    expandGender = (n) => "n" === n ? "neuter" : "m" === n ? "masculine" : "f" === n ? "feminine" : "";
}

// Initializer fetches data and gets the user's settings.
class Initializer {
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

        // On click
        $(".pane-trigger.quiz-begin").addEventListener("click", () => {
           // if (this.quizIsEmpty) return;
            new Formulator().initialize(this.fetched.declensions, this.fetched.vocab, this.options);
        });

        return this;
    }

    quizIsEmpty = () => !declensions && !vocabNum;
}

var Quiz = {
    Initializer, Formulator, WalkthroughMan, Grader
};

let s = new Switcher();
s.listen().showPane("begin");

new Message();
new Quiz.Initializer().initialize();
