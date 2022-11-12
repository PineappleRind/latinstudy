import { createElement, ord } from "../utils.js";
import WalkthroughMan from "./WalkthroughMan.js";

// Formulator handles the formulation of the questions based on
// JSON data, and sends them to WalkthroughMan to start the quiz.

export default class Formulator {
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

        declensions(
            declnum,
            data,
            curData,
            dataLevel = 0,
            formulation,
            cur = {},
            questions
        ) {
            questions ??= [];
            // Set current to the data
            if (!curData) curData = data;
            // For each key in the data
            for (const [k, v] of Object.entries(curData)) {
                // New gender? Set it
                if (dataLevel === 0) cur.gender = k;
                // New grammatical number? Set it
                if (dataLevel === 1) cur.gnumber = k;
                // if it's on an ending
                if (dataLevel === 2) {
                    if (v === "-") break;
                    let formatter = new Intl.ListFormat("en", {
                        style: "long",
                        type: "disjunction",
                    });
                    
                    formulation = {
                        question: `${ord(declnum)} declension ${cur.gnumber} ${formatter.format(
                            cur.gender.split("/").map(this.expandGender)
                        )} ${k} ending`,
                    };
                    // add the answer
                    formulation.answer = v;
                    // add HTML
                    formulation.html = this.htmlGenerator(formulation);
                    // apply changes
                    questions.push(formulation);
                }

                // Not finished? Recurse
                if (v === Object(v))
                    this.questionGenerators.declensions.bind(this)(
                        declnum,
                        data,
                        v,
                        dataLevel + 1,
                        formulation,
                        cur,
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
            grader = createElement('div', 'class:quiz-grade', 'Grade'),
            container = createElement("div", "class:quiz-content-inner");
        input.correct = questionData.answer;

        container.append(title, input, grader);
        return container;
    }
    expandGender = (n) => "n" === n ? "neuter" : "m" === n ? "masculine" : "f" === n ? "feminine" : "";
}