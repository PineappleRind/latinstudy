import { ParsedVocabWord } from "../types";

export default class VocabParser {
    endings: { [key: string] };

    initialize(endings) {
        this.endings = endings;
    }

    parseValue(type: string, str: string) {

    }

    inferCase(vocabWord, $case) {
        // get word stem
        const stem = vocabWord.word.split('-')[0];
        // get corresponding endings;
        // filter for endings that match
        // gender and case
        let endings = this.endings
            .filter(ending =>
                ending.gender === vocabWord.gender
                && ending.case === $case);
        
    }
}