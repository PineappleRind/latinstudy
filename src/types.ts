export type wordType = "noun" | "verb" | "adjective" | "preposition" | "conjunction" | "adverb" | "other"
export type gender = "m" | "f" | "n";

export type caseName = "nominative" | "genitive" | "dative" | "accusative" | "ablative";
export type cases = { [key in caseName]: string; };