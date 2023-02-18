import * as parsers from "./parsers/index.js";
import { Parser } from "./parsers/Parser.js";
import { JSONResource } from "./JSONResource.js";

export class ParserManager {
    /** All imported parsers from dataHandlers/parsers */
    parsers: typeof parsers;
    /** Object to store all parsed data so far */
    data: any;

    constructor() {
        this.parsers = parsers;
        this.data = {};
    }

    async parse(data: JSONResource) {
        let FoundParser = this.parsers[data.id];
        if (FoundParser === undefined) throw new Error(`No parser found with type ${data}!`)
        
        let parsed = await new FoundParser(data.json, this.data).parse();
        this.data[data.id] = parsed;
        return parsed;
    }
}