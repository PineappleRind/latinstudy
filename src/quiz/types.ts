export interface QuizOptions {
  declensions: number;
  vocabNum: number;
  immediateGrade: boolean;
}

export interface QuizQuestion {
    type: string
    question: string,
    answer: string | string[],
    html?: HTMLElement,
    graded?: any;
}

export interface QuizQuestionHTMLOptions {
  title: string,
  super: string
}

export interface VocabWord {
  word: string,
  type: wordType,
  dictionary: string,
  translation: string | string[],
  
  declension?: string,
  gender?: string,
  conjugation?: string,
}

type wordType = "noun" | "verb" | "adjective" | "preposition" | "conjunction" | "adverb" | "other"