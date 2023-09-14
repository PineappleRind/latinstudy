import type { ParsedEndingsData, VocabWord, tense, voice } from "@/types/data";
import { shuffleArray } from "@/utils/shuffleArray";
import type { QuizOptions } from "../../settings/types";
import { generateEndingQuestions } from "./endings";
import type { QuizQuestion } from "./types";
import { generateVocabQuestions } from "./vocabulary";

export function generateQuestions(
	endings: ParsedEndingsData,
	vocab: VocabWord[],
	options: QuizOptions,
): QuizQuestion[] {
	const questions: QuizQuestion[] = [];

	questions.push(...generateVocabQuestions(vocab, options.vocabulary.amount));

	const filteredDeclensions = endings.declensions.filter((x) =>
		options.declensionEndings.declension.includes(x.declension),
	);

	questions.push(
		...generateEndingQuestions<"declensions">(
			"declensions",
			filteredDeclensions,
		),
	);

	const enabledEndings = endings.conjugations.filter((ending) => {
		const { voice, mood, tense, conjugation } = options.conjugationEndings;

		return (
			voice.includes(ending.voice as voice) &&
			mood.includes(ending.mood) &&
			tense.includes(ending.tense as tense) &&
			conjugation.includes(ending.conjugation)
		);
	});

	questions.push(
		...generateEndingQuestions<"conjugations">("conjugations", enabledEndings),
	);

	return shuffleArray<QuizQuestion>(questions);
}
