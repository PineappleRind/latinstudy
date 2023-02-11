type wordType = "noun" | "verb" | "adjective" | "preposition" | "conjunction" | "adverb" | "other"
type gender = "m" | "f" | "n";

export interface VocabWord {
    word: string,
    type: wordType,
    dictionary: string,
    translation: string | string[],
    
    declension?: string,
    gender?: string,
    conjugation?: string,
}

// This is like VocabWord but different.
// No file will need to deal with VocabWord other than dataHandlers/Parser.
// So we don't need it. We can remove VocabWord after dataHandlers/Parser is finished
export interface ParsedVocabWord {
    stem: string,
    type: wordType,
    dictionary: string,
    translation: string | string[],
}

export interface ParsedVocabNoun extends ParsedVocabWord {
    cases: {
        "nominative": string,
        "genitive": string,
        "dative": string,
        "accusative": string,
        "ablative": string
    },
    gender: gender
    declension: number,
}

export interface ParsedVocabVerb extends ParsedVocabWord {
    conjugations: {
        "1st person singular": string,
        "1st person plural": string,
        "dative": string,
        "accusative": string,
        "ablative": string
    },
    conjugation: number,
}