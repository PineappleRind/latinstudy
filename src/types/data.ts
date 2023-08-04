export type wordType =
	| "noun"
	| "verb"
	| "adjective"
	| "preposition"
	| "conjunction"
	| "adverb"
	| "other";
export type gender = "masculine" | "feminine" | "neuter";
export type grammaticalNumber = "singular" | "plural";
/** 1st, second, and third person */
export type person = 1 | 2 | 3;
export type caseName =
	| "nominative"
	| "genitive"
	| "dative"
	| "accusative"
	| "ablative";
export type cases = { [key in caseName]: string };

export interface CaseEnding {
	gender: gender;
	/** Here, number refers to grammatical number. */
	number: string;
	case: caseName;
	ending: string;
	declension: number;
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
	gender?: gender;
}

export type ParsedEndingsData = {
	declensions: CaseEnding[];
	conjugations: ConjugationEnding[];
	pronouns: Pronoun[];
};

export interface VocabWord {
	word: string;
	type: wordType;
	full: string;
	dictionary: string;
	declension: string;
	units: string;
	translation: string;
	gender: gender;
}
