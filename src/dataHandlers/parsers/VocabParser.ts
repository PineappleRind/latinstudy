import { ParsedVocabNoun, ParsedVocabVerb, ParsedVocabWord } from "../../types.js";
import { Parser } from "./Parser.js";
/**
 * Parses vocab for easier usage in the main logic.
 * This parser depends on {@link EndingParser}!! 
 * It needs to use EndingParser's clever way of finding endings.
 * So, EndingParser is called first, and the results are used in VocabParser.
 */
export default class VocabParser extends Parser {
    data: any;

    async parse(data: object) {
        return data;
    }

    decline(vocabWord: ParsedVocabNoun, $case) {
        // get word stem
        const { stem } = vocabWord;
        // get ending based on word information
        let ending = this.data.declensions[vocabWord.declension]
            .find(candidate =>
                candidate.gender === vocabWord.gender
                && candidate.case === $case);
        if (!ending) throw new Error("Invalid case/gender!")

        return stem + ending;
    }

    conjugate(vocabWord: ParsedVocabVerb, person: number, number: number) {
        const { stem } = vocabWord;
        // get ending based on person/number
        let ending = this.data.conjugations[vocabWord.conjugation]
            .find(candidate =>
                candidate.person === person
                && candidate.number === number);
        return stem + ending;
    }

    getDictionaryEntry(vocabWord: ParsedVocabWord) {

    }

    static dependencies = ["endings"];
    static id = "vocab";
}