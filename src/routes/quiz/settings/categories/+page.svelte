<script lang="ts">
    import Multitoggle from "@/components/Multitoggle.svelte";
    import { enabledCategories } from "../stores";
    import { goto } from "$app/navigation";
</script>

<h2>Quiz on...</h2>
<Multitoggle
    items={[
        { name: "Declension Endings", value: "Declensions" },
        { name: "Conjugation Endings", value: "Conjugations" },
        { name: "Vocabulary", value: "Vocabulary" },
    ]}
    let:item
    let:handleSelect
    let:state
    bind:state={$enabledCategories}
>
    <div
        class="multitoggle-item category"
        class:selected={state.includes(item.value)}
        on:click={() => handleSelect(item)}
        on:keydown={() => handleSelect(item)}
    >
        <div class="category-name">{item.name}</div>
        <div class="category-checkbox">
            <div class="category-checkbox-checkmark" />
        </div>
    </div>
</Multitoggle>
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
        min-width: 100%;
        max-width: 300px;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color var(--tr), border var(--tr);
    }
    .category-checkbox {
        width: 18px;
        height: 18px;
        border: 1px solid var(--border-light);
        border-radius: var(--rad-s);
        position: relative;
    }
    .category-checkbox::after {
        content: "";
        background-color: transparent;
        position: absolute;
        width: 3px;
        left: 6px;
        top: 2px;
        border-bottom: 2px solid white;
        height: 8px;
        border-right: 2px solid white;
        rotate: 45deg;
        scale: 0.5;
        opacity: 0;
        transition: opacity var(--tr), scale var(--tr);
    }
    .selected {
        color: hsl(var(--btn-bg-base), 40%);
        border: 1px solid hsl(var(--btn-bg-base), 70%);
        background: hsl(var(--btn-bg-base), 90%);
        animation: category-select 0.4s;
    }
    .selected .category-checkbox {
        background: var(--btn-bg);
    }
    .selected .category-checkbox::after {
        opacity: 1;
        scale: 1;
    }
    @keyframes category-select {
        30% {
            box-shadow: 0 0 0 0px hsla(var(--btn-bg-base), 50%, 1);
            scale: 0.98;
        }
        100% {
            box-shadow: 0 0 0 3px hsla(var(--btn-bg-base), 50%, 0);
        }
    }
</style>
