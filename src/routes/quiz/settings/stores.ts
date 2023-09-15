import type { QuizOptions } from "@/routes/quiz/settings/types";
import storedWritable from "@/routes/stores";

export const options = storedWritable<QuizOptions>("quiz-options", {
	declensionEndings: {
		gender: [],
		number: [],
		case: [],
		ending: [],
		declension: [],
	},
	conjugationEndings: {
		ending: [],
		conjugation: [],
		voice: [],
		mood: [],
		tense: [],
		number: [],
		person: [],
	},
	vocabulary: {
		amount: -1,
		type: [],
	},
	enabled: [],
	settings: {
		immediateGrade: true,
	},
});
