import { expandKey } from "./expand.js";
import type { Declensions, endingType, JSONEndingData, ParsedEndingsData } from "./types";

export function parseEndingData(data: JSONEndingData) {
    let expanded: ParsedEndingsData = <any>{};
    for (const type in data) {
        expanded[type] = expandEndingData(data[type], type as endingType);
    }
    return expanded;
}


/** Takes in EndingData and returns Declensions | Conjugations | Pronouns. 
* It extracts information from the key to convert it into an object. */
function expandEndingData(data: JSONEndingData[keyof JSONEndingData], type: endingType): Declensions {
    let output = {};
    // for each conjugation number/declension number or similar
    for (const number in data) {
        let group = data[number]
        // for each ending 
        for (let key in group) {
            let ending = group[key];
            let expanded = expandKey(key.split("/"), type);
            output[number] ??= [];
            output[number].push({ ending, ...expanded });
        }
    }
    return output;
}