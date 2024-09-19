<script lang="ts">
import Details from "@/routes/view/components/Details.svelte";
import type { ConjugationEnding, mood, voice } from "@/types/data";
import { capitalize } from "@/utils/format";
import { onMount } from "svelte";

export let conjugations: ConjugationEnding[];

const persons = ["1st", "2nd", "3rd"];

let selectedConjugation = "1";
let selectedMood: mood = "indicative";
let selectedVoice: voice = "active";
let availableVoices = ["active", "passive"];
$: if (selectedMood) {
	(availableVoices = Array.from(possibleValuesForKey<"voice">("voice")));
}

function findEnding({
	person,
	number,
	tense,
	voice,
	mood,
}: Omit<ConjugationEnding, "ending">) {
	return conjugations.find(
		(ending) =>
			ending.conjugation === (+selectedConjugation || 1) &&
			+ending.person === person &&
			ending.number === number.toLowerCase() &&
			ending.tense === tense.toLowerCase() &&
			ending.voice === voice.toLowerCase() &&
			ending.mood === mood.toLowerCase(),
	);
}
function reduceToGroup(acc: string, cur: string, i: number, x: string[]) {
	const actualEnding = ` ${cur.split(" ")[1]}`;
	const endingOrComma =
		(i !== x.length - 1 && ", ") ||
		(actualEnding.trim() !== "undefined" ? actualEnding : "");

	acc += `${cur.split(" ")[0]}${endingOrComma} `;
	return acc;
}
function possibleValuesForKey<T extends keyof ConjugationEnding>(
	key: keyof ConjugationEnding,
): Set<ConjugationEnding[T]> {
	const r = conjugations
		.filter(
			(c) => c.mood === selectedMood && c.conjugation === +selectedConjugation,
		)
		.reduce(
			(possible, ending) => possible.add(ending[key as T]),
			new Set<ConjugationEnding[T]>(),
		);
	return r;
}
</script>

<select
    id="view-declension-type"
    style="max-width: 30%;"
    bind:value={selectedConjugation}
>
    <option value="1">1st</option>
    <option value="2">2nd</option>
    <option value="3">3rd</option>
    <option value="4">4th</option>
</select>

<select
    id="view-declension-type"
    style="max-width: 30%;"
    bind:value={selectedMood}
>
    <option selected value="indicative">Indicative</option>
    <option value="subjunctive">Subjunctive</option>
</select>

<select
    id="view-declension-type"
    style="max-width: 30%;"
    bind:value={selectedVoice}
>
    {#each availableVoices as voice}
        <option value={voice}>{capitalize(voice)}</option>
    {/each}
</select>

{#each selectedMood && Array.from(possibleValuesForKey("tense")) as tense}
    <!-- <AnimatedDimensionProvider key={null}> -->
    <Details>
        <h3 slot="summary">{capitalize(tense)}</h3>
        <table class="table">
            <tr>
                <th>Person</th>
                {#each ["Singular", "Plural"] as number}
                    <th class="table-head">{number}</th>
                {/each}
            </tr>
            {#each persons as person, personIndex}
                <tr>
                    <td class="row-shrunk text-subtle">{person}</td>
                    {#each new Array(2) as _, index}
                        <td
                            >{findEnding({
                                person: personIndex + 1,
                                number: index === 0 ? "Singular" : "Plural",
                                conjugation: +selectedConjugation,
                                voice: selectedVoice,
                                mood: selectedMood,
                                tense,
                            })
                                ?.ending.split(",")
                                .reduce(reduceToGroup, "")
                                .trim()}</td
                        >
                    {/each}
                </tr>
            {/each}
        </table>
    </Details>
    <!-- </AnimatedDimensionProvider> -->
{/each}

<!-- </AnimatedDimensionProvider> -->

<style>
    table {
        background: var(--bg-l1);
        min-width: 400px;
        margin: 4px;
        border-collapse: separate;
        border-left: 0;
        border-radius: var(--rad-m);
        border-spacing: 0px;
        border: 1px solid var(--border-light);
    }

    td,
    th {
        padding: 6px 9px;
        vertical-align: top;
    }

    tr td:not(:nth-child(1 of :not([style*="none"]))),
    tr th:not(:nth-child(1 of :not([style*="none"]))) {
        border-left: 1px solid var(--border-light);
    }

    th {
        padding: 5px;
        background: var(--bg-l0);
    }

    td {
        border-top: 1px solid var(--border-light);
    }

    tr:first-child th:nth-child(1 of :not([style*="none"])),
    tr:first-child td:nth-child(1 of :not([style*="none"])) {
        border-radius: var(--rad-m) 0 0 0;
    }

    tr:last-child th:nth-child(1 of :not([style*="none"])),
    tr:last-child td:nth-child(1 of :not([style*="none"])) {
        border-radius: 0 0 0 var(--rad-m);
    }

    tr:first-child th:nth-last-child(1 of :not([style*="none"])),
    tr:first-child td:nth-last-child(1 of :not([style*="none"])) {
        border-radius: 0 var(--rad-m) 0 0;
    }

    tr:last-child th:nth-last-child(1 of :not([style*="none"])),
    tr:last-child td:nth-last-child(1 of :not([style*="none"])) {
        border-radius: 0 0 var(--rad-m) 0;
    }
</style>
