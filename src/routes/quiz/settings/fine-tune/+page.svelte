<script lang="ts">
    import { goto } from "$app/navigation";

    import MultitoggleDropdown from "@/routes/quiz/settings/fine-tune/components/MultitoggleDropdown.svelte";
    import { options } from "@/routes/quiz/settings/stores";

    function isQuizEmpty() {
        function findEmptyProperty(object: Record<string, unknown[]>) {
            return Object.entries(object).find(
                ([_, x]) => !x || x?.length === 0
            )?.[0];
        }
        // User set a category but no filter options selected for it
        const noDeclensions =
            $options.enabled.includes("Declensions") &&
            findEmptyProperty($options.declensionEndings);
        const noConjugations =
            $options.enabled.includes("Conjugations") &&
            findEmptyProperty($options.conjugationEndings);
        const noVocabulary =
            $options.enabled.includes("Vocabulary") &&
            $options.vocabulary.amount === -1 &&
            !$options.vocabulary.type.length;

        return noDeclensions || noConjugations || noVocabulary;
    }

    function handleBegin() {
        const empty = isQuizEmpty();
        if (empty) {
            return;
        }
        goto("/quiz/active");
    }
</script>

<!-- <a class="link back" href="/quiz/settings/categories">Back</a> -->
<h2>Fine-tune your quiz</h2>
{#if $options.enabled.includes("Declensions")}
    <h4>Filter declension endings by</h4>
    <div class="dropdown-flex">
        <MultitoggleDropdown
            bind:state={$options.declensionEndings.declension}
            items={[
                { name: "1st", value: 1 },
                { name: "2nd", value: 2 },
                { name: "3rd", value: 3 },
                { name: "4th", value: 4 },
                { name: "5th", value: 5 },
            ]}
            title="Declension"
        />
        <MultitoggleDropdown
            bind:state={$options.declensionEndings.case}
            items={[
                { name: "Nominative", value: "nominative" },
                { name: "Genitive", value: "genitive" },
                { name: "Dative", value: "dative" },
                { name: "Accusative", value: "accusative" },
                { name: "Ablative", value: "ablative" },
            ]}
            title="Case"
        />
        <MultitoggleDropdown
            bind:state={$options.declensionEndings.gender}
            items={[
                { name: "Masculine", value: "masculine" },
                { name: "Feminine", value: "feminine" },
                { name: "Neuter", value: "neuter" },
            ]}
            title="Gender"
        />
        <MultitoggleDropdown
            bind:state={$options.declensionEndings.number}
            items={[
                { name: "Singular", value: "singular" },
                { name: "Plural", value: "plural" },
            ]}
            title="Number"
        />
    </div>
{/if}
{#if $options.enabled.includes("Conjugations")}
    <h4>Filter conjugation endings by</h4>
    <div class="dropdown-flex" style="--max-width: 1fr">
        <MultitoggleDropdown
            bind:state={$options.conjugationEndings.conjugation}
            items={[
                { name: "1st", value: 1 },
                { name: "2nd", value: 2 },
                { name: "3rd", value: 3 },
                { name: "4th", value: 4 },
            ]}
            title="Conjugation"
        />

        <MultitoggleDropdown
            bind:state={$options.conjugationEndings.voice}
            items={[
                { name: "Active", value: "active" },
                { name: "Passive", value: "passive" },
            ]}
            title="Voice"
        />
        <MultitoggleDropdown
            bind:state={$options.conjugationEndings.mood}
            items={[
                { name: "Indicative", value: "indicative" },
                { name: "Subjunctive", value: "subjunctive" },
            ]}
            title="Mood"
        />
        <MultitoggleDropdown
            bind:state={$options.conjugationEndings.tense}
            items={[
                { name: "Present", value: "present" },
                { name: "Imperfect", value: "imperfect" },
                { name: "Future", value: "future" },
                { name: "Perfect", value: "perfect" },
                { name: "Pluperfect", value: "pluperfect" },
                { name: "Future Perfect", value: "future perfect" },
            ]}
            title="Tense"
        />
        <MultitoggleDropdown
            bind:state={$options.conjugationEndings.number}
            items={[
                { name: "Singular", value: "singular" },
                { name: "Plural", value: "plural" },
            ]}
            title="Number"
        />
        <MultitoggleDropdown
            bind:state={$options.conjugationEndings.person}
            items={[
                { name: "1st", value: 1 },
                { name: "2nd", value: 2 },
                { name: "3rd", value: 3 },
            ]}
            title="Person"
        />
    </div>
{/if}
{#if $options.enabled.includes("Vocabulary")}<div>
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
{/if}
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

<style>
    h4 {
        margin-top: 0.6em;
    }
    .dropdown-flex {
        display: grid;
        --max-width: 205px;
        grid-template-columns: repeat(
            auto-fill,
            minmax(120px, var(--max-width))
        );
        min-width: min(300px, 100vw);
        gap: 5px;
    }
</style>
