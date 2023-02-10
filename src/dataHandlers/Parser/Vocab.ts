//import { ParsedVocabWord } from "../../types";

export default class VocabParser {
    endings: object;

    initialize(endings) {
        this.endings = endings;
    }

    parse(data: object) {
        return data;
    }

    inferCase(vocabWord, $case) {
        // get word stem
        const stem = vocabWord.word.split('-')[0];
        // get corresponding ending;
        // filter for endings that match 
        // vocabWord's information AND case
        let endings = this.endings[vocabWord.declension]
            .filter(ending =>
                ending.gender === vocabWord.gender
                && ending.case === $case);

        console.log(endings)
        
    }
}