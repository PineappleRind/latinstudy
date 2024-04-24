<script lang="ts">
import type { ParsedEndingsData, VocabWord } from "@/types/data";
import Conjugations from "./Conjugations.svelte";
import Declensions from "./Declensions.svelte";
import Vocabulary from "./Vocabulary.svelte";

export let data: ParsedEndingsData & { vocabulary: VocabWord[] };

enum Pane {
	Declensions = 1,
	Conjugations = 2,
	Vocabulary = 3,
}
let selectedPane: Pane = Pane.Declensions;

function handlePaneSelect({
	currentTarget,
}: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
	selectedPane = (Pane as any)[currentTarget.value];
}
</script>

<svelte:head>
    <title>LatinStudier - View</title>
</svelte:head>

<div class="flex">
    <h2>View</h2>
    <select id="view-type" on:input={handlePaneSelect}>
        <option value="Declensions" selected>Declension Endings</option>
        <option value="Conjugations">Conjugation Endings</option>
        <option value="Vocabulary">Vocabulary</option>
    </select>
</div>

{#if selectedPane === Pane.Declensions}
    <Declensions endings={data.declensions} />
{:else if selectedPane === Pane.Conjugations}
    <Conjugations conjugations={data.conjugations} />
{:else if selectedPane === Pane.Vocabulary}
    <Vocabulary {data} />
{/if}

<style>
</style>
