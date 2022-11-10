import { $, fetchToJSON, ord } from './utils.js'

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
  // PreBegin fetches data, gets the user's settings, and 
  // sends both to Begin using a callback.
  PreBegin: class {
    constructor() {
      this.optEls = {
        declensions: $(".quiz-declension-option", 1),
        vocabNum: $(".quiz-vocab-count"),
      };
      this.options = {
        declensions: 0b00000,
        vocabNum: 0
      };

      return this
    }

    async initialize(c) {
      // first, deal with the user's settings
      this.settingsListen();
      // Then the data
      let declensions = await fetchToJSON('./data/declensions.json'),
        vocab = await fetchToJSON('./data/vocab.json');

      this.fetched = { declensions, vocab }
    }

    settingsListen() {
      // Deal with selecting different declensions
      for (const opt of Object.values(this.optEls.declensions)) {
        opt.addEventListener('click', e => {
          e.target.classList.toggle('selected');
          this.options.declensions ^= 0b00001 << (+e.target.dataset.value - 1);
        })
      }
      // Deal with entering different numbers of vocabulary
      this.optEls.vocabNum.addEventListener('input', (e) => {
        this.options.vocabNum = e.target.value;
      })
      return this;
    }
  },
  // Begin handles the questions showing, stores the user's
  // answers, and sends the answers to Finish using a callback.
  Begin: class {
    constructor() {
      this.questions = []
    }

    initialize(declensions, vocab, options) {
      // Only get from the declensions enabled
      let getFrom = {};
      // For every declension enabled
      for (let j = 0; j < Math.log2(16) + 1; j++) { // 5 declensions; base-2 logarithm of 16 = 4 
        let bj = 2 ** j; // 2 to the power of J is its binary counterpart

        // If  1, 2, 4, 8, or 16 is found, then enable
        // declensions 1, 2, 3, 4, or 5, respectively
        if ((bj & options.declensions) === bj) {
          getFrom[j] = declensions[j + 1];
        }
      }

      // TODO 
      // this.questionGenerators.vocab(vocab, options.vocabNum);

      //TODO
      //for (let declnum in getFrom) 
        //this.questions.push(this.questionGenerators.declensions(+declnum + 1, getFrom[declnum]))
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
            type: 'vocab',
            question: r.word,
            answer: r.translation
          })
        }
      },

      // Unfinished
      declensions(declnum, data, cur, curType = 0, questions) {
        /***
         * first (level 0) = gender, contents
         * second (level 1) = singular/plural, contents
         * third (level 2) = case, ending (? times)
         */
        questions ??= [];
        // Set current to the data
        if (!cur) cur = data;
        // Done? return
        if (cur !== Object(cur)) return console.log(questions);
        // For each key in the data
        for (const [k, v] of Object.entries(cur)) {
          console.log(k,v,curType)
          
          if (curType === 0) {
            questions.push({}); // Add an object
            questions[questions.length - 1] = ({ question: `What's the ${ord(declnum)} declension` })
          }
          else if (curType === 1 || curType === 2) questions[questions.length - 1].question += ` ${k}`
          if (curType === 2) questions[questions.length - 1].question += ` ending?`;
          if (v === Object(v)) this.declensions(declnum, data, v, curType + 1, questions);
          else questions.name += `${v} `;
        }
        console.log(questions)
      }
    }
  }
}
let s = new Switcher(),
  qpb = new Quiz.PreBegin(),
  qb = new Quiz.Begin();
qpb.initialize();
$('.pane-trigger.quiz-begin').addEventListener('click', () => {
  qb.initialize(qpb.fetched.declensions, qpb.fetched.vocab, qpb.options)
})
s.listen().showPane("begin");
