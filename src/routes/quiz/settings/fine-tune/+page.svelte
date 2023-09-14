<script context="module" lang="ts">
    import type { QuizOptions } from "../types";
    import { enabledCategories } from "../stores";

    export const options = storedWritable<QuizOptions>("quiz-options", {
        declensionEndings: {
            gender: [],
            number: [],
            case: [],
            ending: [],
            declension: []
        },
        conjugationEndings: {
            ending: [],
            conjugation: [],
            voice: [],
            mood: [],
            tense: [],
            number: [],
            person: []
        },
        vocabulary: {
            amount: -1,
            type: []
        },
        settings: {
            immediateGrade: true,
        },
    });
</script>

<script>
    import { goto } from "$app/navigation";
    import Multitoggle from "@/components/Multitoggle.svelte";
    import storedWritable from "@/routes/stores";
    import MultitoggleDropdown from "./components/MultitoggleDropdown.svelte";
    function isQuizEmpty() {
        // User set a category but no filter options selected for it
        const noDeclensions =
            $enabledCategories.includes("Declensions") &&
            !$options.declensionEndings;
        const noConjugations =
            $enabledCategories.includes("Conjugations") &&
            !$options.conjugationEndings;
        const noVocabulary =
            $enabledCategories.includes("Vocabulary") && !$options.vocabulary;
        return noDeclensions && noConjugations && noVocabulary;
    }

    function handleBegin() {
        if (isQuizEmpty()) return;
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
    <MultitoggleDropdown
        bind:state={$options.declensionEndings.declension}
        items={[
            { name: "1st", value: 1 },
            { name: "2nd", value: 2 },
            { name: "3rd", value: 3 },
            { name: "4th", value: 4 },
            { name: "5th", value: 5 },
        ]}
        title="Declensions"
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
        bind:state={$options.conjugationEndings.conjugation}
        items={[
            { name: "1st", value: 1 },
            { name: "2nd", value: 2 },
            { name: "3rd", value: 3 },
            { name: "4th", value: 4 },
        ]}
    />

    <p>Voices</p>
    <Multitoggle
        items={[
            { name: "Active", value: "active" },
            { name: "Passive", value: "passive" },
        ]}
        bind:state={$options.conjugationEndings.voice}
    />
    <p>Moods</p>
    <Multitoggle
        items={[
            { name: "Indicative", value: "indicative" },
            { name: "Subjunctive", value: "subjunctive" },
        ]}
        bind:state={$options.conjugationEndings.mood}
    />
    <p>Tenses</p>
    <Multitoggle
        items={[
            { name: "Present", value: "present" },
            { name: "Imperfect", value: "imperfect" },
            { name: "Future", value: "future" },
            { name: "Perfect", value: "perfect" },
            { name: "Pluperfect", value: "pluperfect" },
            { name: "Future Perfect", value: "future perfect" },
        ]}
        bind:state={$options.conjugationEndings.tense}
    />
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
            bind:value={$options.vocabulary.amount}
        /><small> (0 for all, -1 for none)</small>
    </div>
</div>
<h4>More settings</h4>
<div class="quiz-immediate-grade-select">
    <input
        checked
        bind:value={$options.settings.immediateGrade}
        type="checkbox"
        id="quiz-immediate-grade"
    />
    <label for="quiz-immediate-grade">Grade each question after submit</label>
</div>
<br />
<button class="btn full-width primary" on:click={handleBegin}> Begin </button>
