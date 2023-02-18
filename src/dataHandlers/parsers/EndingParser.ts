import { caseName, gender as genderType } from "../../types";
import { Parser } from "./Parser";

export interface CaseEnding {
    ending: string;
    /** Here, number refers to grammatical number. */
    number: string;
    declension: number;
    case: caseName;
    gender: genderType;
}

export class EndingParser extends Parser {
    data: { declensions: { [x: string]: { [x: string]: CaseEnding } } };
    public static id: string = "endings";

    /**
     * Converts "m/s/acc" and such to their own keys, such as gender: "masculine", number: "singular" etc...
     * @returns a parsed object with deep layers. Not sure if I'll make a type for it
     */
    async parse() {
        let declensions: { [x: string]: CaseEnding[] } = {};
        // for each declension
        for (const [i, decl] of Object.entries(this.data.declensions)) {
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
                if (!declensions[i]) declensions[i] = [];
                declensions[i].push(ending);
            }
        }
        return {...this.data, declensions};
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


