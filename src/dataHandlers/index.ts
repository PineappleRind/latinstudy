import Parser from "./parser/index.js";
import Resource from "./Resource.js";

export default class DataHandler {
    data: object[];//type for this later
    parser: Parser;

    async initialize() {
        this.data = await Promise.all([
            new Resource("/data/endings.json").load(),
            new Resource("/data/vocab.json").load()
        ]);
        this.parser = new Parser();

        return this;
    }

    parse() {
        return [
            this.parser.parse("endings", this.data[0]),
            this.parser.parse("vocab", this.data[1]),
        ]
    }
}