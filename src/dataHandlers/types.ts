import { Conjugations, Declensions, Pronouns, VocabWord } from "./parse/types";

export type StudierData = {
	conjugations: Conjugations;
	declensions: Declensions;
	pronouns: Pronouns;
	vocab: VocabWord[];
};
