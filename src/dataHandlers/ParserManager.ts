import parsers from "./parsers/index.js";
import { Parser } from "./Parser.js";
import JSONResource from "./JSONResource.js";

export default class ParserManager {
    parsers: { [key: string]: any };

    constructor() {
        this.parsers = parsers;
    }

    parse(data: JSONResource) {
        let FoundParser: Parser = this.parsers[data.id];
        if (FoundParser === undefined) throw new Error(`No parser found with type ${data}!`)
        // Error with this for some reason! Try it yourself...
        // return new FoundParser(data.json).parse();
    }
}