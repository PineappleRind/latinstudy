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

type EndingData<Type> = { [x: string]: Type }


export class EndingParser extends Parser {
    data: { 
        declensions: EndingData<Declensions>,
        conjugations: EndingData<Conjugations>,
        pronouns: EndingData<Pronouns>
    } 
    public static id: string = "endings";

    /**
     * Converts "m/s/acc" and such to their own keys, such as gender: "masculine", number: "singular" etc...
     * @returns a parsed object with deep layers. Not sure if I'll make a type for it
     */
    async parse() {
        type ParsedEndingData = { declensions: Declensions, conjugations: Conjugations, pronouns: Pronouns }
        let parsed: ParsedEndingData = {
            declensions: this.parseDeclensions(this.data.declensions),
            conjugations: this.parseConjugations(this.data.conjugations),
            pronouns: this.parsePronouns(this.data.pronouns),
        }

        return parsed;
    }
    
    parseDeclensions(declensions: EndingData<Declensions>) {
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

    parsePronouns(pronouns: EndingData<Pronouns>)/*: Pronouns*/ {
        return pronouns
    }

    parseConjugations(conjugations: EndingData<Conjugations>)/*: Conjugations*/ {
        return conjugations
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


