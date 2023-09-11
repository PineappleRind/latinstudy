<script lang="ts">
    import type { Writable } from "svelte/store";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import { options } from "@/routes/quiz/settings/fine-tune/+page.svelte";
    import { generateQuestions } from "@/routes/quiz/active/generateQuizQuestions/main";
    import { gradeQuestion } from "@/routes/quiz/active/grade";
    import QuizQuestion from "@/components/QuizQuestion.svelte";
    import type { ParsedEndingsData, VocabWord } from "@/types/data";
    import { lastQuiz } from "@/routes/stores";
    import AnimatedDimensionProvider from "@/components/AnimatedDimensionProvider.svelte";

    export let data: ParsedEndingsData & { vocabulary: VocabWord[] };

    const questions = generateQuestions(
        {
            declensions: data.declensions,
            conjugations: data.conjugations,
            pronouns: data.pronouns,
        },
        data.vocabulary,
        $options
    );

    enum NextEvent {
        Grade = 1,
        Next = 2,
        Finish = 3,
    }

    let currentIndex: number = 0;
    $: if (!questions[currentIndex]) goto("/quiz/results");
    let nextEvent = $options.immediateGrade ? NextEvent.Grade : NextEvent.Next;

    let inputValue: Writable<string | null>;
    let nextButtonDisabled = false;
    $: nextButtonDisabled =
        !$inputValue?.replaceAll(" ", "") && !questions[currentIndex].grade;

    function handleNext() {
        if (nextEvent === NextEvent.Grade) {
            const score = gradeQuestion(
                questions[currentIndex],
                $inputValue || ""
            );
            questions[currentIndex].grade = {
                score,
                userAnswer: $inputValue || "",
                answer: questions[currentIndex].answer,
            };
            nextEvent = NextEvent.Next;
        } else if (nextEvent === NextEvent.Next) {
            if (!questions[currentIndex + 1]) return finish();
            if (!questions[currentIndex + 2]) nextEvent = NextEvent.Finish;
            currentIndex += 1;
            if (!questions[currentIndex].grade) nextEvent = NextEvent.Grade;
            inputValue.set("");
        }
    }

    function handlePrevious() {
        if (currentIndex === 0) return;
        currentIndex -= 1;
        nextEvent = NextEvent.Next;
    }

    onMount(() => {
        onkeydown = (e) => {
            if (e.key === "Enter") handleNext();
        };
    });

    function finish() {
        lastQuiz.set({
            date: new Date(),
            questions,
        });
        return void goto("/quiz/results");
    }
</script>

<a class="link pane-trigger" href="/quiz/settings">⊗ End quiz</a>
<h2>
    Quiz <span style="font-size: 12px;opacity:0.6"
        >{currentIndex + 1}/{questions.length}</span
    >
</h2>
<AnimatedDimensionProvider key={currentIndex}>
    <QuizQuestion bind:inputValue question={questions[currentIndex]} />
</AnimatedDimensionProvider>

<div class="flex">
    <button
        disabled={currentIndex === 0}
        on:click={handlePrevious}
        class="btn quiz-prev">Previous</button
    >
    <button
        disabled={nextButtonDisabled}
        class="btn primary full-width quiz-next"
        on:click={handleNext}
        >{["Grade", "Next", "Finish"][nextEvent - 1]}</button
    >
</div>
