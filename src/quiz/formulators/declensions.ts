import { map, ord } from "../../utils.js";
import { createQuizQuestion } from "../components/QuizQuestion.js";
import { QuizQuestion as Formulation } from "../types.js";

/**
 * Generates a list of questions about a certain declension.
 * @param declnum Declension to generate on.
 * @param endings Data itself.
 * @returns An array of question Formulations.
 */
export function formulateDeclensionQuestion(declnum, endings) {
  let questions: Formulation[] = [];
  for (const [type, ending] of Object.entries(endings)) {
    if (ending === "-" || !ending) continue; // no ending? continue

    let question = formatQuestionString(declnum, type),
      answer = ending.toString();
    // format the question
    let formulation: Formulation = {
      type: "declension",
      question, answer,
      html: createQuizQuestion({ title: question, super: "what's the ending?" })
    };
    // apply changes
    questions.push(formulation);
  }
  // Finished? Return!
  return questions;
}

/**
 * @param declnum Current declension, to specify in the string.
 * @param type Encoded Magic Values™. This will be parsed and expanded by {@link EndingParser} in the future.
 * @returns The formatted question string (to ask the user).
 */
function formatQuestionString(declnum: number, type: string): string {
  // split the key into its information components
  let [gender, gnumber, $case] = type.split("/");
  // expand genders
  let genders = gender
    .split("")
    .map((g) => map[g])
    .join("/");

  return `${ord(declnum.toString())} declension ${map[$case]} ${map[gnumber]
    } (${genders})`;
}
