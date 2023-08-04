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
    <h4 class="view-decl-super">singular</h4>
    <table class="view-decl-table singular">
      <tr>
        <th>Case</th>
        <th class="view-table-head singular masculine">Masculine</th>
        <th class="view-table-head singular feminine">Feminine</th>
        <th class="view-table-head singular neuter">Neuter</th>
      </tr>
      <tr>
        <td class="table-row-shrunk text-subtle">Nominative</td>
        <td class="view-table-field singular nominative masculine" />
        <td class="view-table-field singular nominative feminine" />
        <td class="view-table-field singular nominative neuter" />
      </tr>
      <tr>
        <td class="table-row-shrunk text-subtle">Genitive</td>
        <td class="view-table-field singular genitive masculine" />
        <td class="view-table-field singular genitive feminine" />
        <td class="view-table-field singular genitive neuter" />
      </tr>
      <tr>
        <td class="table-row-shrunk text-subtle">Dative</td>
        <td class="view-table-field singular dative masculine" />
        <td class="view-table-field singular dative feminine" />
        <td class="view-table-field singular dative neuter" />
      </tr>
      <tr>
        <td class="table-row-shrunk text-subtle">Accusative</td>
        <td class="view-table-field singular accusative masculine" />
        <td class="view-table-field singular accusative feminine" />
        <td class="view-table-field singular accusative neuter" />
      </tr>
      <tr>
        <td class="table-row-shrunk text-subtle">Ablative</td>
        <td class="view-table-field singular ablative masculine" />
        <td class="view-table-field singular ablative feminine" />
        <td class="view-table-field singular ablative neuter" />
      </tr>
    </table>
    <h4 class="view-decl-super">Plural</h4>
    <table class="view-decl-table plural">
      <tr>
        <th>Case</th>
        <th class="view-table-head plural masculine">Masculine</th>
        <th class="view-table-head plural feminine">Feminine</th>
        <th class="view-table-head plural neuter">Neuter</th>
      </tr>
      <tr>
        <td>Nominative</td>
        <td class="view-table-field plural nominative masculine" />
        <td class="view-table-field plural nominative feminine" />
        <td class="view-table-field plural nominative neuter" />
      </tr>
      <tr>
        <td>Genitive</td>
        <td class="view-table-field plural genitive masculine" />
        <td class="view-table-field plural genitive feminine" />
        <td class="view-table-field plural genitive neuter" />
      </tr>
      <tr>
        <td>Dative</td>
        <td class="view-table-field plural dative masculine" />
        <td class="view-table-field plural dative feminine" />
        <td class="view-table-field plural dative neuter" />
      </tr>
      <tr>
        <td>Accusative</td>
        <td class="view-table-field plural accusative masculine" />
        <td class="view-table-field plural accusative feminine" />
        <td class="view-table-field plural accusative neuter" />
      </tr>
      <tr>
        <td>Ablative</td>
        <td class="view-table-field plural ablative masculine" />
        <td class="view-table-field plural ablative feminine" />
        <td class="view-table-field plural ablative neuter" />
      </tr>
    </table>
  </div>
  <div class="view-pane view-vocab hidden" data-view-association="vocab" />
</div>
