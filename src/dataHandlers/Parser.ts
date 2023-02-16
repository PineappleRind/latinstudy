export abstract class Parser {
    finished: boolean;
    data: any;
    id: string;
    new (data) {
        this.data = data;
        this.finished = false;
    }
    abstract parse(d: any[]): any;
}