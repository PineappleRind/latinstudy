import { ParsedVocabNoun, ParsedVocabVerb } from "../../types.js";

export default class VocabParser {
    endings: any;

    initialize(endings) {
        this.endings = endings;
    }

    parse(data: object) {
        return data;
    }

    decline(vocabWord: ParsedVocabNoun, $case) {
        // get word stem
        const { stem } = vocabWord;
        // get ending based on word information
        let ending = this.endings.declensions[vocabWord.declension]
            .find(candidate =>
                candidate.gender === vocabWord.gender
                && candidate.case === $case);
        if (!ending) throw new Error("Invalid case/gender!")

        return stem + ending;
    }

    conjugate(vocabWord: ParsedVocabVerb, person: number, number: number) {
        const { stem } = vocabWord;
        // get ending based on person/number
        let ending = this.endings.conjugations[vocabWord.conjugation]
            .find(candidate =>
                candidate.person === person
                && candidate.number === number);
        return stem + ending;
    }

    static parses = "vocab";
}