<script lang="ts">
  import { goto, afterNavigate } from "$app/navigation";
  import { base } from "$app/paths";

  let previousPage: string = base;

  afterNavigate(({ from }) => {
    previousPage = from?.url.pathname || previousPage;
  });
</script>

<a class="link pane-trigger" href={previousPage}>⊗ End quiz</a>
<h2>
  Quiz <span style="font-size: 12px;opacity:0.6"
    ><span id="count-current" />/<span id="count-total" /></span
  >
</h2>
<div class="quiz-content-wrapper">
  <div class="quiz-content" />
</div>

<div class="flex">
  <button disabled class="btn quiz-prev">Previous</button>
  <button disabled class="btn primary full-width quiz-next">Next</button>
</div>
