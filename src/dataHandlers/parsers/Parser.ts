/**
 * Abstraction for EndingParser and VocabParser.
 */
export abstract class Parser {
    data: any;
    id: string;
    new (data) {
        this.data = data;
    }
    abstract parse(d: any[]): any;
}