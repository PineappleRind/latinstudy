/** The user's specified options from the quiz-begin pane. */
export interface QuizOptions {
	declensions: number;
	vocabNum: number;
	immediateGrade: boolean;
}

/** A quiz question under the hood. */
export interface QuizQuestion {
	type: string;
	question: string;
	answer: string | string[];
	html: HTMLElement;
}

/** What createQuizQuestion is sent when it's needed to generate a quiz question html */
export interface QuizQuestionHTMLOptions {
	title: string;
	super: string;
}
/** 2 = correct, 1 = partially correct, 0 = wrong. */
export type QuizQuestionScore = 2 | 1 | 0;

export type GradedQuizQuestion = QuizQuestion & {
	response: string;
	grade: {
		score: QuizQuestionScore;
		answer: string | string[];
		userAnswer: string;
	};
};

// for later
type wordType =
	| "noun"
	| "verb"
	| "adjective"
	| "preposition"
	| "conjunction"
	| "adverb"
	| "other";
