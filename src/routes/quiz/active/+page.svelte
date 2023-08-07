<script lang="ts">
  import { quadIn } from "svelte/easing";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  
  import { scale } from "@/routes/animations";
  import { options } from "@/routes/quiz/settings/+page.svelte";
  import { generateQuestions } from "@/routes/quiz/active/generateQuizQuestions/main";
  import { gradeQuestion } from "@/routes/quiz/active/grade";
  import QuizQuestion from "@/components/QuizQuestion.svelte";
  import type { ParsedEndingsData, VocabWord } from "@/types/data";
    import { page } from "$app/stores";
    import { lastQuiz } from "@/routes/stores";

  export let data: ParsedEndingsData & { vocabulary: VocabWord[] };

  let contentDimensions: DOMRectReadOnly;
  let dimensionsCSS: string;
  $: if (contentDimensions)
    dimensionsCSS = `width: ${contentDimensions.width}px; height: ${contentDimensions.height}px`;

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

  let currentInput: HTMLInputElement;
  function handleNext() {
    if (nextEvent === NextEvent.Grade) {
      const score = gradeQuestion(questions[currentIndex], currentInput?.value);
      questions[currentIndex].grade = {
        score,
        userAnswer: currentInput?.value,
        answer: questions[currentIndex].answer,
      };
      nextEvent = NextEvent.Next;
    } else if (nextEvent === NextEvent.Next) {
      if (!questions[currentIndex+1]) return finish();
      currentIndex += 1;
      if (!questions[currentIndex].grade) nextEvent = NextEvent.Grade;
    } else if (nextEvent === NextEvent.Finish) {
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
      questions
    })
    return void goto("/quiz/results");
  }
</script>

<a class="link pane-trigger" href="/quiz/settings">⊗ End quiz</a>
<h2>
  Quiz <span style="font-size: 12px;opacity:0.6"
    >{currentIndex + 1}/{questions.length}</span
  >
</h2>
<div style={dimensionsCSS} class="quiz-content-wrapper">
  {#key currentIndex}
    <div
      in:scale|local={{ delay: 200, ease: quadIn }}
      out:scale|local={{ duration: $page.route.id?.includes("active") ? 200 : 0 }}
      bind:contentRect={contentDimensions}
      class="quiz-content-animator"
    >
      <QuizQuestion
        bind:input={currentInput}
        question={questions[currentIndex]}
      />
    </div>
  {/key}
</div>

<div class="flex">
  <button
    disabled={currentIndex === 0}
    on:click={handlePrevious}
    class="btn quiz-prev">Previous</button
  >
  <button
    disabled={!currentInput?.value.replaceAll(" ", "") &&
      !questions[currentIndex].grade}
    class="btn primary full-width quiz-next"
    on:click={handleNext}>{["Grade", "Next", "Finish"][nextEvent - 1]}</button
  >
</div>

<style>
  .quiz-content-wrapper {
    transition: width 0.4s, height 0.4s;
    position: relative;
    overflow: hidden;
  }

  .quiz-content-animator {
    width: max-content;
    min-width: 300px;
    position: absolute;
  }
</style>
