<script lang="ts">
    import type { VocabWord } from "@/types/data.js";

    export let data;
    const maxLesson = (data.vocabulary as VocabWord[]).reduce(
        (prev, cur) => (prev < cur.lesson ? (prev = cur.lesson) : prev),
        0
    );
</script>

<h2>Configure</h2>
<label for="maxLesson">I'm on lesson </label>
<input id="maxLesson" type="number" min="1" max={maxLesson} value={maxLesson} />
<p>
    <small>
        This determines what parts of the material to make available to you.
    </small>
</p>
