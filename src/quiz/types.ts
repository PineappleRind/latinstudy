/** Only contain endings with these characteristics. */
export interface ConjugationSettings {
	voices: string[];
	moods: string[];
	tenses: string[];
	persons: string[];
}

/** The user's specified options from the quiz-begin pane. */
export interface QuizOptions {
	declensions: number;
	conjugations: number;
	conjugationSettings?: ConjugationSettings;
	vocabNum: number;
	immediateGrade: boolean;
}

export interface QuizQuestion {
	type: string;
	question: string;
	answer: string | string[];
	html: DocumentFragment;
	response?: string;
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
/** 2 = correct, 1 = partially correct, 0 = wrong. */
export type QuizQuestionScore = 2 | 1 | 0;

export type QuizAnswer = {
	response: string;
	score: QuizQuestionScore | null;
};
