import type {
	Conjugations,
	Declensions,
	Pronouns,
	VocabWord,
} from "@/types/parsedData";

export type StudierData = {
	conjugations: Conjugations;
	declensions: Declensions;
	pronouns: Pronouns;
	vocab: VocabWord[];
};
