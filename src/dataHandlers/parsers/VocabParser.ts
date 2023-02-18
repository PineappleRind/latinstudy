import { wordType, cases, gender } from "../../types.js";
import { purify } from "../../utils.js";
import { CaseEnding } from "./EndingParser.js";
import { Parser } from "./Parser.js";

export interface VocabWord {
    stem: string;
    type: wordType;
    dictionary: string;
    translation: string | string[];
}

export interface VocabNoun extends VocabWord {
    cases: cases;
    gender: gender;
    declension: number;
}

export interface VocabVerb extends VocabWord {
    conjugations: {
        "1st person singular": string;
        "1st person plural": string;
        "dative": string;
        "accusative": string;
        "ablative": string;
    };
    conjugation: number;
}

/**
 * Parses vocab for easier usage in the main logic.
 * This parser depends on {@link EndingParser}.
 * It needs to use EndingParser's clever way of finding endings.
 * So, EndingParser is called first, and the results are used in VocabParser.
 */
export class VocabParser extends Parser {
    data: any;

    async parse() {
        console.log(this.past)
        const parsed: VocabWord[] = [];
        for (let word of this.data) {
            // expand its contractions
            word = this.expand(word);

            word.stem = word.word.split('-')[0];
            if (word.type === 'noun') {
                word.declensions = this.decline(word);
            }
            parsed.push(word);
        }
        return this.data;
    }

    decline(word: VocabNoun) {
        // get ending based on word information
        let endings: CaseEnding[] = this.past.endings.declensions[word.declension]
            .filter(candidate => candidate.gender === word.gender);

        let out = {};
        for (const ending of endings) 
            out[`${ending.number}/${ending.case}`] = word.stem + ending.ending;

        if (!endings.length) throw new Error("Invalid case/gender!")

        return out;
    }

    appendEnding(stem: string, ending) {
        if (stem.endsWith("i") && purify(ending).startsWith("i")) {
            stem = stem.slice(0, -1)
        }
    }

    conjugate(vocabWord: VocabVerb, person: number, number: number) {
        const { stem } = vocabWord;
        // get ending based on person/number
        let ending = this.data.conjugations[vocabWord.conjugation]
            .find(candidate =>
                candidate.person === person
                && candidate.number === number);
        return stem + ending;
    }

    getDictionaryEntry(vocabWord: VocabWord) {

    }

    static dependencies = ["endings"];
    static id = "vocab";
}