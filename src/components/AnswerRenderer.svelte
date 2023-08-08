<script lang="ts">
    import { onMount } from "svelte";

    export let answers: string | string[];
    $: if (!Array.isArray(answers)) answers = [answers];

</script>

<span class="rendered-answer">
    {#each answers as answer, index}{answer.split("|")[0]}
        {#if answer.split("|")[1]}<span class="answer-note text-subtler"
                >({answer.split("|")[1]})</span
            >
        {/if}{#if index !== answers.length - 1}, {/if}{/each}
</span>

<style>
    .answer-note {
        font-style: italic;
        font-size: 12px;
        opacity: 0.4;
    }
</style>
