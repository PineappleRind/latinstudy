<script lang="ts">
    import AnimatedDimensionProvider from "@/components/AnimatedDimensionProvider.svelte";
    import type {
        ConjugationEnding,
        gender,
        tense as Tense,
        voice,
    } from "@/types/data";
    import { onMount } from "svelte";

    export let conjugations: ConjugationEnding[];

    const persons = ["1st", "2nd", "3rd"];
    const voices = ["Active", "Passive"];
    const tenses = [
        "Present",
        "Imperfect",
        "Future",
        "Perfect",
        "Pluperfect",
        "Future Perfect",
    ];
    // const moods = ["Indicative"];

    let selectedConjugation: HTMLSelectElement;

    onMount(() => {
        selectedConjugation.oninput = () => {};
    });

    function findEnding({
        person,
        number,
        tense,
        voice,
        mood,
    }: Omit<ConjugationEnding, "ending">) {
        console.log(
            person,
            number,
            tense,
            voice,
            mood,
            +selectedConjugation?.value?.slice(0, 1) || 1
        );
        return conjugations.find(
            (ending) =>
                ending.conjugation === (+selectedConjugation?.value || 1) &&
                ending.person.toString() ===
                    person.toString().toLowerCase()?.slice(0, 1) &&
                ending.number === number.toLowerCase() &&
                ending.tense === tense.toLowerCase() &&
                ending.voice === voice.toLowerCase() &&
                ending.mood === mood.toLowerCase()
        );
    }
</script>

<select
    id="view-declension-type"
    style="max-width: 30%;"
    bind:this={selectedConjugation}
>
    <option value="1">1st</option>
    <option value="2">2nd</option>
    <option value="3">3rd</option>
    <option value="4">4th</option>
</select>
{#key selectedConjugation}
    {#each voices as voice}
        <AnimatedDimensionProvider key={"voice"}
            ><details>
                <summary><h3>{voice}</h3></summary>
                {#each tenses as tense}
                    <AnimatedDimensionProvider key={null}
                        ><details>
                            <summary>{tense}</summary>
                            <table class="table">
                                <tr>
                                    <th />
                                    {#each ["Singular", "Plural"] as number}
                                        <th class="table-head">{number}</th>
                                    {/each}
                                </tr>
                                {#each persons as person}
                                    <tr>
                                        <td class="row-shrunk text-subtle"
                                            >{person}</td
                                        >
                                        {#each new Array(2) as _, index}
                                            <td
                                                >{findEnding({
                                                    person: persons[index],
                                                    number:
                                                        index === 0
                                                            ? "Singular"
                                                            : "Plural",
                                                    conjugation:
                                                        +selectedConjugation?.value,
                                                    voice,
                                                    mood: "Indicative",
                                                    tense,
                                                })?.ending}</td
                                            >
                                        {/each}
                                    </tr>
                                {/each}
                            </table>
                        </details>
                    </AnimatedDimensionProvider>
                {/each}
            </details>
        </AnimatedDimensionProvider>
    {/each}
{/key}

<style>
    table {
        background: var(--bg-l1);
        min-width: 400px;
        margin: 4px;
        border-collapse: separate;
        border-left: 0;
        border-radius: var(--rad-m);
        border-spacing: 0px;
        border: 1px solid var(--light-border);
    }

    td,
    th {
        padding: 6px 9px;
        vertical-align: top;
    }

    tr td:not(:nth-child(1 of :not([style*="none"]))),
    tr th:not(:nth-child(1 of :not([style*="none"]))) {
        border-left: 1px solid var(--light-border);
    }

    th {
        padding: 5px;
        background: var(--bg-l0);
    }

    td {
        border-top: 1px solid var(--light-border);
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

    summary h3 {
        display: inline-block;
    }
    details > :global(:not(summary)) {
        margin-left: 1em;
    }
</style>
