export type wordType =
	| "noun"
	| "verb"
	| "adjective"
	| "preposition"
	| "conjunction"
	| "adverb"
	| "other";
export type tense =
	| "present"
	| "imperfect"
	| "future"
	| "perfect"
	| "pluperfect";
export type voice = "active" | "passive";
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
	person: number;
}

export interface Pronoun {
	person: number;
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
	lesson: number;
	translation: string;
	gender: gender;
}
