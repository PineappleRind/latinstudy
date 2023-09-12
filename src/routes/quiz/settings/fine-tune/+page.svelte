<script context="module" lang="ts">
    import type { QuizOptions } from "../types";
    import { enabledCategories } from "../stores";

    export const options = storedWritable<QuizOptions>("quiz-options", {
        declensions: [],
        conjugations: [],
        conjugationSettings: {
            voices: ["active"],
            tenses: ["present"],
            moods: [],
        },
        vocabCount: -1,
        immediateGrade: true,
    });
</script>

<script>
    import { goto } from "$app/navigation";
    import Multitoggle from "@/components/Multitoggle.svelte";
    import storedWritable from "@/routes/stores";

    function quizIsEmpty() {
        const noDeclensions = !$options.declensions.length;
        const noConjugationCustomization = Object.values(
            $options.conjugationSettings
        ).some((arr) => !arr.length);
        const noConjugations =
            !$options.conjugations.length ||
            ($options.conjugations.length && noConjugationCustomization);
        const noVocab = $options.vocabCount < 0;
        return noDeclensions && noConjugations && noVocab;
    }

    function handleBegin() {
        if (quizIsEmpty()) return;
        goto("/quiz/active");
    }
</script>

<a class="link back" href="/quiz/settings/categories">Back</a>
<h2>Fine-tune your quiz</h2>
<div
    style={!$enabledCategories.includes("Declensions") ? "display: none" : null}
    class="quiz-option-select"
>
    <h4>Include these declensions...</h4>
    <Multitoggle
        bind:state={$options.declensions}
        items={[
            { name: "1st", value: 1 },
            { name: "2nd", value: 2 },
            { name: "3rd", value: 3 },
            { name: "4th", value: 4 },
            { name: "5th", value: 5 },
        ]}
    />
</div>
<div
    style={!$enabledCategories.includes("Conjugations")
        ? "display: none"
        : null}
>
    <h4>Include these conjugations...</h4>
    <Multitoggle
        min={1}
        bind:state={$options.conjugations}
        items={[
            { name: "1st", value: 1 },
            { name: "2nd", value: 2 },
            { name: "3rd", value: 3 },
            { name: "4th", value: 4 },
        ]}
    />

    <fieldset
        class:open={$options.conjugations.length > 0}
        id="quiz-conj-settings"
    >
        <div class="fieldset-inner">
            <p>Include voices...</p>
            <Multitoggle
                items={[
                    { name: "Active", value: "active" },
                    { name: "Passive", value: "passive" },
                ]}
                bind:state={$options.conjugationSettings.voices}
            />
            <p>Include moods...</p>
            <Multitoggle
                items={[
                    { name: "Indicative", value: "indicative" },
                    { name: "Subjunctive", value: "subjunctive" },
                ]}
                bind:state={$options.conjugationSettings.moods}
            />
            <p>Include tenses...</p>
            <Multitoggle
                items={[
                    { name: "Present", value: "present" },
                    { name: "Imperfect", value: "imperfect" },
                    { name: "Future", value: "future" },
                    { name: "Perfect", value: "perfect" },
                    { name: "Pluperfect", value: "pluperfect" },
                    { name: "Future Perfect", value: "future perfect" },
                ]}
                bind:state={$options.conjugationSettings.tenses}
            />
        </div>
    </fieldset>
</div>
<div
    style={!$enabledCategories.includes("Vocabulary") ? "display: none" : null}
>
    <h4>Vocabulary</h4>
    <div class="quiz-vocab-select">
        <p># of vocabulary words to quiz on (randomized)</p>
        <input
            type="number"
            placeholder="Enter..."
            class="quiz-vocab-count"
            bind:value={$options.vocabCount}
        /><small> (0 for all, -1 for none)</small>
    </div>
</div>
<h4>More settings</h4>
<div class="quiz-immediate-grade-select">
    <input
        checked
        bind:value={$options.immediateGrade}
        type="checkbox"
        id="quiz-immediate-grade"
    />
    <label for="quiz-immediate-grade">Grade each question after submit</label>
</div>
<br />
<button class="btn full-width primary" on:click={handleBegin}> Begin </button>

<style>
    fieldset {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows var(--tr-l), opacity var(--tr),
            padding var(--tr);
        opacity: 0;
        padding-block: 0px;
        pointer-events: none;
    }
    fieldset .fieldset-inner {
        min-height: 0;
    }
    fieldset.open {
        overflow: hidden;
        pointer-events: all;
        padding-block: 10px;
        opacity: 1;
        grid-template-rows: 1fr;
    }
</style>