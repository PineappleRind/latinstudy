import { $, fetchToJSON } from '../utils.js';

// Initializer fetches data and gets the user's settings.
export default class Initializer {
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
}