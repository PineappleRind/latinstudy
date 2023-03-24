
import { caseName, gender as genderType, grammaticalNumber } from "../../types";

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

export interface Pronouns { [x: string]: Pronoun[] }
export interface Conjugations { [x: string]: ConjugationEnding[] }
export interface Declensions { [x: string]: CaseEnding[] };

/** endings.json */
export type JSONEndingData = {
  [x: string]: Record<string, Record<string, string>>,
}
/** After being parsed by EndingParser. */
export type ParsedEndingsData = Record<endingType, Declensions | Conjugations | Pronouns>;

export type endingType = "declensions" | "conjugations" | "pronouns";