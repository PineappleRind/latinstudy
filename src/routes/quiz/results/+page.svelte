<script lang="ts">
    import AnswerRenderer from "@/components/AnswerRenderer.svelte";
    import { QuizQuestionScore } from "@/routes/quiz/active/generateQuizQuestions/types";
    import { lastQuiz } from "@/routes/stores";

    const correctQuestions = $lastQuiz?.questions
        .map((q) => q.grade?.score || 0)
        .reduce((acc: number, cur) => {
            return acc + (cur !== QuizQuestionScore.Wrong ? 1 : 0);
        }, 0);
</script>

<h2>Quiz Results</h2>
{#if $lastQuiz}
    <p>Taken {$lastQuiz.date.toLocaleString()}</p>
    <h4>Your grade</h4>
    <p>
        {(((correctQuestions || 0) / $lastQuiz.questions.length) * 100).toFixed(
            1
        )}% |
        {correctQuestions}/{$lastQuiz.questions.length}
    </p>
    <h4>Questions</h4>
    {#each $lastQuiz.questions as question, index}
        <div class="question">
            {index + 1}. {question.question}:&nbsp;
            {#if question.grade?.score === QuizQuestionScore.Wrong}
                <span class="question-wrong-answer">
                    {question.grade?.userAnswer}
                </span>—
            {:else if question.grade?.score === QuizQuestionScore.Partial}
                <span class="question-partial-answer">
                    {question.grade?.userAnswer}
                </span>—
            {/if}
            <span
                class={(question.grade?.score === QuizQuestionScore.Correct &&
                    "question-correct-answer") ||
                    null}
            >
                <AnswerRenderer answers={question.answer} />
            </span>
        </div>
    {/each}
    <a class="btn full-width" href="/">Back home</a>
{:else}
    <p>You've not completed any quizzes recently.</p>
    <br />
    <a href="/quiz/settings" class="btn full-width">Start a quiz</a>
{/if}

<style>
    .question {
        white-space: break-word;
    }
    .question-wrong-answer {
        color: red;
        font-weight: 300;
        text-decoration: line-through;
        margin-right: 4px;
        display: inline-block;
    }

    .question-correct-answer {
        color: green;
        font-weight: 600;
        white-space: nowrap;
    }

    .question-correct-answer::after {
        content: "✓";
    }

    .question-partial-answer {
        color: var(--partial-correct-border);
        filter: brightness(50%) hue-rotate(170deg) invert(1) saturate(2);
    }
</style>
