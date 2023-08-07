<script lang="ts">
    export let answers: string | string[];
    if (typeof answers === "string") answers = [answers];
</script>

<span class="rendered-answer">
    {#each answers as answer, index}{answer.split("|")[0]}
        {#if answer.split("|")[1]}<span class="answer-note text-subtler">({answer.split("|")[1]})</span>
        {/if}{#if index !== answers.length - 1}, {/if}{/each}
</span>
