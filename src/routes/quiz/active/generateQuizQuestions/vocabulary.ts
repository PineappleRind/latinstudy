import { maxLesson } from "@/routes/stores";
import type { VocabWord as VocabularyWord } from "@/types/data";
import { shuffleArray } from "@/utils/shuffleArray";
import { get } from "svelte/store";
import type { QuizQuestion } from "./types";

export function generateVocabQuestions(
    vocabulary: VocabularyWord[],
    amount: number,
) {
    const result: QuizQuestion[] = [];

    shuffleArray(vocabulary);

    for (let i = 0; i < (amount || vocabulary.length); i++) {
        const randomWord = vocabulary[i];
        if (
            randomWord.lesson > (get(maxLesson) || Number.POSITIVE_INFINITY) //||
            // randomWord.lesson <= 41
        )
            continue;

        result.push({
            type: "vocab",
            question: randomWord.word,
            answer: randomWord.translation,
            word: randomWord,
        });
    }
    return result;
}
