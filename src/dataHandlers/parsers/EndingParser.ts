import { Parser } from "./Parser";

//todo
type ParsedEnding=void;

export default class EndingParser extends Parser {
    data: ParsedEnding[];
    public static id: string = "endings";

    async parse(endings) {
        return endings;
        // will work on this later
        for (const decl of endings) {
            
        }
    }
}


