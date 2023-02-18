/** The user's specified options from the quiz-begin pane. */
export interface QuizOptions {
  declensions: number;
  vocabNum: number;
  immediateGrade: boolean;
}

/** A quiz question under the hood. */
export interface QuizQuestion {
    type: string
    question: string,
    answer: string | string[],
    html: HTMLElement,
    graded?: any;
}

/** What createQuizQuestion is sent when it's needed to generate a quiz question html */
export interface QuizQuestionHTMLOptions {
  title: string,
  super: string
}
/** 2 = correct, 1 = partially correct, 0 = wrong. */
export type QuizQuestionGrade = 2 | 1 | 0;

// for later
type wordType = "noun" | "verb" | "adjective" | "preposition" | "conjunction" | "adverb" | "other"