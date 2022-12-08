import { createElement, shuffleArray } from "../../utils.js";

export default function vocab(vocab, num) {
    let result = [];
    num = +num;
    
    if (num === 0) num = vocab.length;
    else if (num === -1) num = 0;
    // shuffle
    shuffleArray(vocab);
    // For as many as the user wants,
    for (let i = 0; i < num; i++) {
        // get a random vocab word from the vocab JSON
        let r = vocab[i];
        // then generate 1 of 3 vocab question types
        result.push({
            type: "vocab",
            question: r.word,
            answer: r.translation,
            html: generateVocabHTML(r)
        });
    }
    return result;
}

function generateVocabHTML(questionData) {
    let title = createElement(
        "h3",
        "class:quiz-question-title",
        `What does <b>${questionData.word}</b> mean?`
    ),
        input = createElement(
            "input",
            "placeholder:What's the translation? Enter...;type:text;class:quiz-question-input"
        ),
        container = createElement("div", "class:quiz-content-inner");

    container.append(title, input);
    return container;
}