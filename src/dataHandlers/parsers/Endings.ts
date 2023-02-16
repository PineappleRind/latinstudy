import { Parser } from "../Parser";

//todo
type ParsedEnding=void;

export default class EndingParser extends Parser {
    finished: boolean;
    data: ParsedEnding[];
    public static id: string = "endings";

    async parse(endings) {
        this.finished = true;
        return endings;
        // will work on this later
        for (const decl of endings) {
            
        }
    }
}