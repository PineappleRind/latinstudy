import type { tense, voice } from "@/types/data";

export type QuizOptions = {
	declensions: number[];
	conjugations: number[];
	conjugationSettings: {
		voices: voice[];
		tenses: tense[];
		moods: string[];
	};
	vocabCount: number;
	immediateGrade: boolean;
};
