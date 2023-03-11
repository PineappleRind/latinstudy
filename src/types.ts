export type wordType = "noun" | "verb" | "adjective" | "preposition" | "conjunction" | "adverb" | "other"
export type gender = "masculine" | "feminine" | "neuter";
export type grammaticalNumber = "singular" | "plural";
/** 1st, second, and third person */
export type person = 1 | 2 | 3;
export type caseName = "nominative" | "genitive" | "dative" | "accusative" | "ablative";
export type cases = { [key in caseName]: string; };