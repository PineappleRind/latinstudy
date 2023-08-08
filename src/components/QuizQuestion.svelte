<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import {
        QuizQuestionScore,
        type QuizQuestion,
    } from "@/routes/quiz/active/generateQuizQuestions/types";

    export let question: QuizQuestion;
    export let inputValue: Writable<string | null> = writable(
        question.grade?.userAnswer || null
    );
    function getSuper() {
        if (question.type === "vocab")
            return `translate the ${question.word?.type}`;
        return `what's the ending?`;
    }
</script>

<h4 class="quiz-question-super">{getSuper()}</h4>
<h3 class="quiz-question-title">{question.question}</h3>
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
        {[question.grade.answer].flat().join(", ")}
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
        margin-bottom: 3px;
        font-size: 1rem;
        border-bottom: 0 !important;
        padding-bottom: 0;
    }

    .quiz-question-title {
        font-weight: 500;
    }

    .quiz-correct-answer {
        padding: 3px;
        margin: 2px;
        background: var(--bg-l1);
        border-radius: var(--rad-m);
        width: fit-content;
        font-size: var(--txt-s);
    }

    .quiz-correct-answer::before {
        content: "Correct answer: ";
        color: var(--txt-c2);
        font-style: italic;
    }
</style>
