<script lang="ts">
  const cases = ["Nominative", "Genitive", "Accusative", "Dative", "Ablative"];
  const genders = ["Masculine", "Feminine", "Neuter"];
  const numbers = ["Singular", "Plural"];
</script>

<a class="link back" href="/">Home</a>
<div class="flex">
  <h2>View</h2>
  <select id="view-type">
    <option value="declensions" selected>Declension Endings</option>
    <option value="vocab">Vocabulary</option>
  </select>
</div>
<div class="flex">
  <input
    id="view-vocab-search"
    type="text"
    class="hidden full-width"
    placeholder="Search..."
    data-view-association="vocab"
  />
  <select
    id="view-declension-type"
    style="max-width: 30%;"
    data-view-association="declensions"
  >
    <option value="1" selected>1st</option>
    <option value="2">2nd</option>
    <option value="3">3rd</option>
    <option value="4">4th</option>
    <option value="5">5th</option>
  </select>
  <select
    id="view-vocab-type"
    style="max-width: 30%;"
    class="hidden"
    data-view-association="vocab"
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
<div class="view-panes">
  <div class="view-pane view-decl" data-view-association="declensions">
    {#each numbers as number}
      <h4 class="super">{number}</h4>
      <table class="table">
        <tr>
          <th>Case</th>
          {#each genders as gender}
            <th class="table-head">{gender}</th>
          {/each}
        </tr>
        {#each cases as case$}
          <td class="row-shrunk text-subtle">{case$}</td>
          <td class="table-field" />
        {/each}
      </table>
    {/each}
  </div>
  <div class="view-pane view-vocab hidden" data-view-association="vocab" />
</div>
