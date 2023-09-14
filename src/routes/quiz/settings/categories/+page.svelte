<script lang="ts">
    import { goto } from "$app/navigation";
    import Checkbox from "../components/Checkbox.svelte";
    import { enabledCategories } from "../stores";

    function handleSelect(value: string) {
        if ($enabledCategories.includes(value))
            enabledCategories.set(
                $enabledCategories.filter((i) => i !== value)
            );
        else enabledCategories.set([...$enabledCategories, value]);
    }
</script>

<h2>Quiz on...</h2>
{#each ["Declensions", "Conjugations", "Vocabulary"] as item}
    <div
        class="category"
        class:selected={$enabledCategories.includes(item)}
        on:click={() => handleSelect(item)}
        on:keydown={() => handleSelect(item)}
    >
        <div class="category-name">{item}</div>
        <Checkbox selected={$enabledCategories.includes(item)} />
    </div>
{/each}
<button
    on:click={() => goto("/quiz/settings/fine-tune")}
    disabled={$enabledCategories.length < 1}
    class="btn primary full-width"
>
    Next
</button>

<style>
    .category {
        border: 1px solid var(--border-light);
        border-radius: var(--rad-m);
        padding: 6px 8px;
        margin: 2px 0;
        min-width: 100%;
        max-width: 300px;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color var(--tr), border var(--tr);
    }

    .selected {
        --text-lightness: 50%;
        color: hsl(var(--btn-bg-base), var(--text-lightness));
        border: 1px solid hsl(var(--btn-bg-base), 70%);
        background: hsla(var(--btn-bg-base), 50%, 0.2);
        animation: category-select 0.4s;
    }
    @media (prefers-color-scheme: dark) {
        .selected {
            --text-lightness: 80%;
        }
    }
    @keyframes category-select {
        30% {
            box-shadow: 0 0 0 0px hsla(var(--btn-bg-base), 80%, 1);
            scale: 0.98;
        }
        100% {
            box-shadow: 0 0 0 3px hsla(var(--btn-bg-base), 50%, 0);
        }
    }
</style>
