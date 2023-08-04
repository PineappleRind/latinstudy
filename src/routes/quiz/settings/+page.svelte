<script>
  import Multitoggle from "../../../components/Multitoggle.svelte";
</script>

<a class="link back" href="/">Home</a>
<h2>Quiz Settings</h2>
<h4>Quiz on declensions...</h4>
<div class="quiz-option-select">
  <Multitoggle
    items={[
      { name: "1st", value: 1 },
      { name: "2nd", value: 2 },
      { name: "3rd", value: 3 },
      { name: "4th", value: 4 },
      { name: "5th", value: 5 },
    ]}
  />
</div>
<h4>Quiz on conjugations...</h4>
<div>
  <div class="quiz-option-select">
    <div
      class="multitoggle-option"
      data-multitoggle-group="quiz-conj"
      data-value="1"
    >
      1st
    </div>
    <div
      class="multitoggle-option"
      data-multitoggle-group="quiz-conj"
      data-value="2"
    >
      2nd
    </div>
    <div
      class="multitoggle-option"
      data-multitoggle-group="quiz-conj"
      data-value="3"
    >
      3rd
    </div>
    <div
      class="multitoggle-option"
      data-multitoggle-group="quiz-conj"
      data-value="4"
    >
      4th
    </div>
  </div>
  <fieldset id="quiz-conj-settings">
    <p>Include voices...</p>
    <div class="quiz-option-select">
      <div
        class="multitoggle-option"
        data-multitoggle-group="quiz-conj-voices"
        data-value="active"
      >
        Active
      </div>
      <div
        class="multitoggle-option"
        data-multitoggle-group="quiz-conj-voices"
        data-value="passive"
      >
        Passive
      </div>
    </div>
    <!-- <p>Include moods...</p>
      <div class="quiz-option-select">
        <div class="quiz-option" data-multitoggle-group="quiz-conj-moods" data-value="1">Indicative</div>
        <div class="quiz-option" data-multitoggle-group="quiz-conj-moods" data-value="2">Subjunctive</div>
      </div> -->
    <p>Include tenses...</p>
    <div class="quiz-option-select">
      <div
        class="multitoggle-option"
        data-multitoggle-group="quiz-conj-tense"
        data-value="present"
      >
        Present
      </div>
      <div
        class="multitoggle-option"
        data-multitoggle-group="quiz-conj-tense"
        data-value="imperfect"
      >
        Imperfect
      </div>
      <div
        class="multitoggle-option"
        data-multitoggle-group="quiz-conj-tense"
        data-value="future"
      >
        Future
      </div>
      <div
        class="multitoggle-option"
        data-multitoggle-group="quiz-conj-tense"
        data-value="perfect"
      >
        Perfect
      </div>
      <div
        class="multitoggle-option"
        data-multitoggle-group="quiz-conj-tense"
        data-value="pluperfect"
      >
        Pluperfect
      </div>
      <div
        class="multitoggle-option"
        data-multitoggle-group="quiz-conj-tense"
        data-value="future perfect"
      >
        Future Perfect
      </div>
    </div>
  </fieldset>
</div>
<h4>Vocabulary</h4>
<div class="quiz-vocab-select">
  <p># of vocabulary words to quiz on (randomized)</p>
  <input
    type="number"
    placeholder="Enter..."
    class="quiz-vocab-count"
    value=""
  /><small> (0 for all, leave empty for none)</small>
</div>
<h4>More settings</h4>
<div class="quiz-immediate-grade-select">
  <input checked type="checkbox" id="quiz-immediate-grade" />
  <label for="quiz-immediate-grade">Grade each question after submit</label>
</div>
<br />
<a class="btn full-width primary" href="/quiz/active"> Begin </a>
