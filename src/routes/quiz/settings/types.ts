import type { CaseEnding, ConjugationEnding, wordType } from "@/types/data";

type AllPropertiesArrays<T> = {
	[P in keyof T]: T[P][];
};

export type QuizOptions = {
	declensionEndings: AllPropertiesArrays<CaseEnding>;
	conjugationEndings: AllPropertiesArrays<ConjugationEnding>;
	vocabulary: { type: wordType[] } & {
		amount: number;
	};
	enabled: string[];
	settings: {
		immediateGrade: boolean;
	};
};
