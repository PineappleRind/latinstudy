import EndingParser from "./Endings.js";
import VocabParser from "./Vocab.js";

export default class Parser {
    endings: EndingParser;
    vocab: VocabParser;

    constructor() {
        this.endings = new EndingParser();
        this.vocab = new VocabParser();
    }

    parse(type: "endings" | "vocab", data) {
        return this[type].parse(data);
    }
}