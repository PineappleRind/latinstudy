import { createElement } from "../../utils.js";
import { QuizQuestion as Formulation } from "../types.js";

interface QuizQuestionHTMLOptions {
    title: string,
    super: string
}

export default class QuizQuestion {
    create(options: QuizQuestionHTMLOptions): HTMLElement {
        let title = createElement("h3", "class:quiz-question-title", options.title),
            input = createElement("input", "placeholder:What is it? Enter...;type:text;class:quiz-question-input"),
            header = createElement("h4", "class:quiz-question-super", options.super),
            container = createElement("div", "class:animator-inner");

        container.append(header, title, input);
        return container;
    }
}
