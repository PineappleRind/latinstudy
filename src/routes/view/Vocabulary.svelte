<script lang="ts">
    import AnswerRenderer from "@/components/AnswerRenderer.svelte";
    import type { VocabWord } from "@/types/data";
    import { purify } from "@/utils/purify";

    export let data;

    function sort(words: VocabWord[]) {
        return words.sort((a, b) =>
            purify(a.word).toLowerCase() > purify(b.word).toLowerCase() ? 1 : -1
        );
    }
    let vocabulary = sort(data.vocabulary);
    let typeFilter: string;
    let searchFilter: string = "";
    $: {
        if (typeFilter === "*") vocabulary = data.vocabulary.sort();
        else
            vocabulary = data.vocabulary.filter(
                (word: VocabWord) => word.type === typeFilter
            );
        vocabulary = vocabulary.filter((word: VocabWord) =>
            word.word.includes(searchFilter)
        );
    }
</script>

<div class="flex">
    <input type="text" bind:value={searchFilter} class="hidden full-width" placeholder="Search..." />
    <select
        id="view-vocab-type"
        style="max-width: 30%;"
        data-view-association="vocab"
        bind:value={typeFilter}
    >
        <option selected value="*">All</option>
        <option value="noun">Nouns</option>
        <option value="verb">Verbs</option>
        <option value="adjective">Adjectives</option>
        <option value="preposition">Prepositions</option>
        <option value="conjunction">Conjunctions</option>
        <option value="pronoun">Pronouns</option>
        <option value="other">Sayings & Miscellanous</option>
    </select>
</div>
{#each vocabulary as word}
    <div class="word">
        {word.word}{word.dictionary ? `, ${word.dictionary}` : ""}
        <AnswerRenderer answers={word.translation} />
    </div>
{/each}

<style>
    .word {
        margin: 1px;
        padding: 4px 8px;
        border-bottom: 1px solid var(--light-border);
    }

    .word:last-child {
        border-bottom: 0;
    }

    .word :global(.rendered-answer) {
        margin-left: 10px;
        color: var(--txt-c2);
    }
</style>