import type { QuizOptions } from "@/routes/quiz/settings/types";
import storedWritable from "@/routes/stores";

export const options = storedWritable<QuizOptions>("quiz-options", {
	declensionEndings: {
		declension: [],
		gender: ["feminine", "masculine", "neuter"],
		number: ["singular", "plural"],
		case: ["nominative", "genitive", "dative", "accusative", "ablative"],
	},
	conjugationEndings: {
		conjugation: [],
		voice: ["active"],
		mood: ["indicative"],
		tense: ["present"],
		number: ["singular", "plural"],
		person: [1, 2, 3],
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
