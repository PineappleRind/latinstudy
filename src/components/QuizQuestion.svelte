<script lang="ts">
    import {
        QuizQuestionScore,
        type QuizQuestion,
    } from "@/routes/quiz/active/generateQuizQuestions/types";

    export let input: HTMLInputElement | null = null;

    export let question: QuizQuestion;
    function getSuper() {
        if (question.type === "vocab")
            return `translate the ${question.word?.type}`;
        return `what's the ending?`;
    }
</script>

<h4 class="quiz-question-super">{getSuper()}</h4>
<h3 class="quiz-question-title">{question.question}</h3>
<input
    bind:this={input}
    class:wrong={question.grade?.score === QuizQuestionScore.Wrong}
    class:correct={question.grade?.score === QuizQuestionScore.Correct}
    class:partial-correct={question.grade?.score === QuizQuestionScore.Partial}
    disabled={(question.grade && true) || null}
    placeholder="What is it? Enter..."
    type="text"
    class="quiz-question-input"
    value={question.grade?.userAnswer || null}
/>
{#if question.grade}
    <p>Correct answer: {question.grade.answer}</p>
{/if}

<style>
    .quiz-question-input {
        width: calc(100% - 6px);
        transition: background-color 0.2s, border 0.2s;
    }
    .quiz-question-input.correct {
        background: var(--correct-bg);
        border: var(--correct-border);
    }

    .quiz-question-input.wrong {
        background: var(--wrong-bg);
        border: var(--wrong-border);
        color: red;
    }

    .quiz-question-input.partial-correct {
        background: var(--partial-correct-bg);
        border: var(--partial-correct-border);
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
</style>
