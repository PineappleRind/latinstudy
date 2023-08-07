<script lang="ts">
  import type { ParsedEndingsData, VocabWord } from "@/types/data";
  import Declensions from "./Declensions.svelte";
  import Vocabulary from "./Vocabulary.svelte";

  export let data: ParsedEndingsData & { vocabulary: VocabWord[] };

  enum Pane {
    Declensions = 1,
    Vocabulary = 2,
  }
  let selectedPane: Pane = Pane.Vocabulary;

  function handlePaneSelect({
    currentTarget,
  }: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
    selectedPane = (Pane as any)[currentTarget.value];
  }
</script>

<a class="link back" href="/">Home</a>
<div class="flex">
  <h2>View</h2>
  <select id="view-type" on:input={handlePaneSelect}>
    <option value="Declensions" selected>Declension Endings</option>
    <option value="Vocabulary">Vocabulary</option>
  </select>
</div>

{#if selectedPane === Pane.Declensions}
  <Declensions />
{:else if selectedPane === Pane.Vocabulary}
  <Vocabulary {data} />
{/if}

<style>
</style>
