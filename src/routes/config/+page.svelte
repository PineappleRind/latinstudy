<script lang="ts">
import type { VocabWord } from "@/types/data.js";
import { maxLesson as maxLessonStore } from "../stores.js";

export let data;
const maxLesson = (data.vocabulary as VocabWord[]).reduce(
	(prev, cur) => (prev < cur.lesson ? (prev = cur.lesson) : prev),
	0,
);
if (!$maxLessonStore) $maxLessonStore = maxLesson;
</script>

<h2>Configure</h2>
<label for="maxLesson">I'm on lesson </label>
<input
    id="maxLesson"
    type="number"
    min="1"
    max={maxLesson}
    bind:value={$maxLessonStore}
/>
<p>
    <small>
        This determines what parts of the material to make available to you.
    </small>
</p>
