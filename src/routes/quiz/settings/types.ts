import type {
	CaseEnding,
	ConjugationEnding,
	VocabWord,
	wordType,
} from "@/types/data";

type AllPropertiesArrays<T> = {
	[P in keyof T]: T[P][];
};

export type QuizOptions = {
	declensionEndings: AllPropertiesArrays<CaseEnding>;
	conjugationEndings: AllPropertiesArrays<ConjugationEnding>;
	vocabulary: { type: wordType[] } & {
		amount: number;
	};
	settings: {
		immediateGrade: boolean;
	};
};
