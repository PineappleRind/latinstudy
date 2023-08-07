import type {
	CaseEnding,
	ConjugationEnding,
	ParsedEndingsData,
	VocabWord,
	tense,
	voice,
} from "@/types/data";
import type { QuizOptions } from "../../settings/+page.svelte";
import { generateVocabQuestions } from "./vocabulary";
import { generateEndingQuestions } from "./endings";
import { shuffleArray } from "@/utils/shuffleArray";
import type { QuizQuestion } from "./types";

export function generateQuestions(
	endings: ParsedEndingsData,
	vocab: VocabWord[],
	options: QuizOptions,
): QuizQuestion[] {
	const questions: QuizQuestion[] = [];

	questions.push(...generateVocabQuestions(vocab, options.vocabCount));

	const filteredDeclensions = endings.declensions.filter((x) =>
		options.declensions.includes(x.declension),
	);

	questions.push(
		...generateEndingQuestions<"declensions">(
			"declensions",
			filteredDeclensions,
		),
	);

	const enabledEndings = endings.conjugations.filter((ending) => {
		const { voices, moods, persons, tenses } = options.conjugationSettings;
		return (
			voices.includes(ending.voice as voice) &&
			moods.includes(ending.mood) &&
			persons.includes(ending.person) &&
			tenses.includes(ending.tense as tense)
		);
	});

	questions.push(
		...generateEndingQuestions<"conjugations">("conjugations", enabledEndings),
	);

	return shuffleArray<QuizQuestion>(questions);
}
