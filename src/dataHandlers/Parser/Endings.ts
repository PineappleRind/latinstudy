//todo
type ParsedEnding=void;

export default class EndingParser {
    endings: ParsedEnding//[];

    initialize(endings) {
        this.endings = this.parse(endings);
    }

    parse(endings) {
        return endings;
        // will work on this laters
        for (const decl of endings) {
            
        }
    }
}