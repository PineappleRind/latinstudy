import { caseName, gender as genderType, grammaticalNumber } from "../../types";
import { Parser } from "./Parser";

export interface CaseEnding {
    ending: string;
    /** Here, number refers to grammatical number. */
    number: string;
    declension: number;
    case: caseName;
    gender: genderType;
}

export interface ConjugationEnding {
    ending: string;
    conjugation: number;
    voice: string;
    mood: string;
    tense: string;
    number: string;
    person: string;
}

export interface Pronoun {
    person: string;
    number: grammaticalNumber;
    case: caseName;
    gender?: genderType;
}

export interface Pronouns { [x: string]: Pronoun[] }
export interface Conjugations { [x: string]: ConjugationEnding[] }
export interface Declensions { [x: string]: CaseEnding[] };

// TODO: make this into one generic type
type DeclensionData = { [x: string]: Declensions };
type PronounData = { [x: string]: Pronouns };
type ConjugationData = { [x: string]: Conjugations };

export class EndingParser extends Parser {
    data: { 
        declensions: DeclensionData,
        conjugations: ConjugationData,
        pronouns: PronounData
    } 
    public static id: string = "endings";

    /**
     * Converts "m/s/acc" and such to their own keys, such as gender: "masculine", number: "singular" etc...
     * @returns a parsed object with deep layers. Not sure if I'll make a type for it
     */
    async parse() {
        //todo fix this
        type ParsedEndingData = { declensions: Declensions, conjugations: Conjugations, Pronouns: PronounData }
        let parsed: ParsedEndingData = {};
        parsed.declensions = this.parseDeclensions(this.data.declensions as DeclensionData);
        parsed.conjugations = this.parseConjugations(this.data.conjugations);
        parsed.pronouns = this.parsePronouns(this.data.pronouns);
        return {...this.data, declensions: this.data.declensions};
    }
    
    parseDeclensions(declensions: DeclensionData) {
        let output: Declensions = {};
        // for each declension
        for (const [i, decl] of Object.entries(declensions)) {
            // for each ending in the declension
            for (const endingKey in decl) {
                // Ignore notes
                if (endingKey === "note") continue;
                let information = this.extractFromKey(endingKey);
                let ending: CaseEnding = {
                    ...information,
                    ending: decl[endingKey],
                    declension: i,
                };
                if (!output[i]) output[i] = [];
                output[i].push(ending);
            }
        }

        return output;
    }

    parsePronouns(pronouns: PronounData)/*: Pronouns*/ {

    }

    parseConjugations(conjugations: ConjugationData)/*: Conjugations*/ {

    }
    /** 
     * @param key a key like m/s/abl
     * @returns for the parameter above, { gender: "masculine", number: "singular", case: "ablative" } 
     */
    extractFromKey(key: string) {
        let split = key.split("/");
        if (split.length !== 3) throw new Error(`Malformed ending with key ${key}!`);

        type splitKeyInfo = [genderType, string, caseName];
        let [gender, number, $case]: splitKeyInfo = split as splitKeyInfo;
        return this.expand({
            gender,
            number,
            case: $case,
        })
    }
}


