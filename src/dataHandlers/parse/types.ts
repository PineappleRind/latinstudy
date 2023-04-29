import type {
	caseName,
	gender as genderType,
	grammaticalNumber,
	wordType,
} from "@/types/studier";

export interface CaseEnding {
	gender: genderType;
	/** Here, number refers to grammatical number. */
	number: string;
	case: caseName;
	ending: string;
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

export type Pronouns = Record<string, Pronoun[]>;
export type Conjugations = Record<string, ConjugationEnding[]>;
export type Declensions = Record<string, CaseEnding[]>;

export interface VocabWord {
	word: string;
	type: wordType;
	full: string;
	dictionary: string;
	declension: string;
	units: string;
	translation: string;
	gender: genderType;
}

/** endings.json */
export type JSONEndingsData = {
	declensions: Record<string, Record<string, string>>;
	conjugations: Record<string, Record<string, string>>;
	pronouns: Record<string, Record<string, string>>;
};

/** After being parsed by EndingParser. */
export type ParsedEndingsData = {
	declensions: Declensions;
	conjugations: Conjugations;
	pronouns: Pronouns;
};

export type endingType = "declensions" | "conjugations" | "pronouns";
