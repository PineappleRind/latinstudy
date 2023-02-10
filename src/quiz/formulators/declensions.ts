import { map, ord, createElement } from "../../utils.js";
import QuizQuestion from "../components/QuizQuestion.js";
import { QuizQuestion as Formulation } from "../types";

export default function declensions(declnum, endings) {
  let questions: Formulation[] = [];
  for (const [type, ending] of Object.entries(endings)) {
    if (ending === "-" || !ending) continue; // no ending? continue

    let question = formatQuestionString(declnum, type),
      answer = ending.toString();
    // format the question
    let formulation: Formulation = {
      type: "declension",
      question, answer,
      html: new QuizQuestion().create({ title: question, super: "what's the ending?" })
    };
    // apply changes
    questions.push(formulation);
  }
  // Finished? Return!
  return questions;
}

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
