<script lang="ts">
    import type { CaseEnding, caseName, gender } from "@/types/data";

    export let endings: CaseEnding[];

    const cases = [
        "Nominative",
        "Genitive",
        "Accusative",
        "Dative",
        "Ablative",
    ];
    const genders = ["Masculine", "Feminine", "Neuter"];
    const numbers = ["Singular", "Plural"];

    let selectedDeclension = "1";
    let gendersInDeclension: Set<gender> = new Set(["feminine"]);
    $: {
        // since bind:value sends back a string
        selectedDeclension = +selectedDeclension;
        gendersInDeclension = endings
            .filter((e) => e.declension === selectedDeclension)
            .reduce((acc, cur) => {
                acc.add(cur.gender);
                return acc;
            }, new Set<gender>());
    }

    function findEnding(number: string, case$: string, genderColumn: number) {
        const gender = genders[genderColumn];
        return endings.find(
            (ending) =>
                ending.case === case$.toLowerCase() &&
                ending.declension === selectedDeclension &&
                ending.gender === gender.toLowerCase() &&
                ending.number === number.toLowerCase()
        );
    }
</script>

<select
    id="view-declension-type"
    style="max-width: 30%;"
    bind:value={selectedDeclension}
>
    <option value="1">1st</option>
    <option value="2">2nd</option>
    <option value="3">3rd</option>
    <option value="4">4th</option>
    <option value="5">5th</option>
</select>
{#key selectedDeclension}
    {#each numbers as number}
        <h4 class="super">{number}</h4>
        <table class="table">
            <tr>
                <th>Case</th>
                {#each genders as gender}
                    {#if gendersInDeclension.has(gender.toLowerCase())}
                        <th class="table-head">{gender}</th>
                    {/if}
                {/each}
            </tr>
            {#each cases as case$}
                <tr>
                    <td class="row-shrunk text-subtle">{case$}</td>
                    {#each new Array(3) as _, index}
                        {#if gendersInDeclension.has(genders[index].toLowerCase())}
                            <td>{findEnding(number, case$, index)?.ending}</td>
                        {/if}
                    {/each}
                </tr>
            {/each}
        </table>
    {/each}
{/key}

<style>
    table {
        background: var(--bg-l1);
        width: 100%;
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
</style>
