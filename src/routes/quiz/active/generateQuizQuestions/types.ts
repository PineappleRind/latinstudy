import type { VocabWord, person, tense, voice } from "@/types/data";

/** Only contain endings with these characteristics. */
export interface ConjugationSettings {
	voices: voice[];
	moods: string[];
	tenses: tense[];
	persons: person[];
}

export interface QuizQuestion {
	type: "declensions" | "conjugations" | "vocab";
	question: string;
	answer: string | string[];
	response?: string;
	/** Only if type === "vocab" */
	word?: VocabWord;
	grade?: {
		score: QuizQuestionScore;
		answer: string | string[];
		userAnswer: string;
	};
}

/** What createQuizQuestion is sent when it's needed to generate a quiz question html */
export interface QuizQuestionHTMLOptions {
	title: string;
	super: string;
}

export enum QuizQuestionScore {
	Wrong = 1,
	Partial = 2,
	Correct = 3,
}

export type QuizAnswer = {
	response: string;
	score: QuizQuestionScore | null;
};
