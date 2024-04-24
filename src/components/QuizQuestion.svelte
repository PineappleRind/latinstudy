<script lang="ts">
import {
	type QuizQuestion,
	QuizQuestionScore,
} from "@/routes/quiz/active/generateQuizQuestions/types";
import { type Writable, writable } from "svelte/store";
import AnswerRenderer from "./AnswerRenderer.svelte";

export let question: QuizQuestion;
$: if (question.grade) {
	$inputValue = question.grade?.userAnswer;
}
export let inputValue: Writable<string | null> = writable(
	question.grade?.userAnswer || null,
);
function getSuper() {
	if (question.type === "vocab") return `translate the ${question.word?.type}`;
	return `what's the ending?`;
}
</script>

<h4 class="quiz-question-super">{getSuper()}</h4>
<p class="quiz-question-title">{question.question}</p>
<input
    bind:value={$inputValue}
    class:wrong={question.grade?.score === QuizQuestionScore.Wrong}
    class:correct={question.grade?.score === QuizQuestionScore.Correct}
    class:partial-correct={question.grade?.score === QuizQuestionScore.Partial}
    disabled={(question.grade && true) || null}
    placeholder="What is it? Enter..."
    type="text"
    class="quiz-question-input"
/>
{#if question.grade}
    <p class="quiz-correct-answer">
        <AnswerRenderer answers={question.grade.answer} />
    </p>
{/if}

<style>
    .quiz-question-input {
        width: calc(100% - 6px);
        transition: background-color 0.2s, border 0.2s;
    }

    .quiz-question-input.correct {
        background: var(--correct-bg);
        border: 1px solid var(--correct-border);
    }

    .quiz-question-input.wrong {
        background: var(--wrong-bg);
        border: 1px solid var(--wrong-border);
        color: red;
    }

    .quiz-question-input.partial-correct {
        background: var(--partial-correct-bg);
        border: 1px solid var(--partial-correct-border);
    }

    .quiz-question-super {
        margin-bottom: 0;
        font-size: 1rem;
        border-bottom: 0 !important;
        padding-bottom: 0;
    }

    .quiz-question-title {
        font-weight: 500;
        font-size: 1.2em;
        margin-bottom: 0.4em;
        letter-spacing: -0.04em;
    }

    .quiz-correct-answer {
        padding: 3px;
        margin: 2px;
        width: fit-content;
        font-size: var(--txt-s);
    }

    .quiz-correct-answer::before {
        content: "Correct answer: ";
        color: var(--txt-c2);
        font-style: italic;
    }
</style>
