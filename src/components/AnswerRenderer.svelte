<script lang="ts">
    import { onMount } from "svelte";

    export let answers: string | string[];
    $: if (!Array.isArray(answers)) answers = [answers];

    let text = "";
    onMount(() => {
        for (const [i, answer] of (answers as string[]).entries()) {
            const [word, note] = answer.split("|");
            text += word;
            if (note)
                text += `<span class="answer-note text-subtler">(${note})</span>`;
            if (i !== answers.length - 1) text += ", ";
        }
    });
</script>

<span class="rendered-answer">
    {@html text}
</span>

<style>
    :global(.answer-note) {
        font-style: italic;
        font-size: 12px;
        margin-left: 0.3em;
        opacity: 0.6;
    }
</style>
