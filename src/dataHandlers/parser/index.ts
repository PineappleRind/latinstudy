import EndingParser from "./Endings.js";
import VocabParser from "./Vocab.js";

export default class Parser {
    parsers: any[];

    constructor() {
        this.parsers = [EndingParser, VocabParser];
    }

    parse(data) {
        let FoundParser = this.parsers.find(el => data.id === el.parses);
        if (!FoundParser) throw new Error(`No parser found with type ${data!}`)
        return new FoundParser().parse(data.json);
    }
}