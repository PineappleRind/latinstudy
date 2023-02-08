export type QuizOptions = {
    declensions: number;
    vocabNum: number;
    immediateGrade: boolean;
}

export type QuizQuestion = {
    type: string
    question: string,
    answer: string,
    html?: HTMLElement,
    graded?: any;
}