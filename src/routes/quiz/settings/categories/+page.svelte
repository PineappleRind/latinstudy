<script lang="ts">
    import Multitoggle from "@/components/Multitoggle.svelte";
</script>

<h2>Quiz on...</h2>
<br />
<Multitoggle
    min={1}
    items={[
        { name: "Declensions", value: "Declensions" },
        { name: "Conjugations", value: "Conjugations" },
        { name: "Vocabulary", value: "Vocabulary" },
    ]}
    let:item
    let:handleSelect
    let:state
>
    <div
        class="multitoggle-item category"
        class:selected={state.includes(item.value)}
        on:click={() => handleSelect(item)}
        on:keydown={() => handleSelect(item)}
    >
        <div class="category-trigger" />
        <div class="category-name">{item.name}</div>
    </div>
</Multitoggle>

<style>
    .category {
        margin-inline: 0.1em;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 2;
        position: relative;
        min-height: 100px;
        width: 110px;
        padding: 20px;
        transition: scale var(--tr), margin var(--tr),
            background-color var(--tr);
        scale: 1;
        font-size: 0.9rem;
        border-radius: var(--rad-m);
        overflow: hidden;
        border: 1px solid transparent;
        background: var(--bg-l2);
    }
    .category.selected {
        margin-inline: 0.67em;
        background: var(--bg-l3);
        scale: 1.1;
        border: 1px solid var(--border-light);
    }
    .category::after {
        position: absolute;
        content: "";
        clip-path: polygon(
            28% 38%,
            41% 53%,
            75% 24%,
            86% 38%,
            40% 78%,
            15% 50%
        );
        width: 100%;
        height: 100%;
        background-image: radial-gradient(
            circle at 0% 100%,
            transparent 20%,
            white 240%
        );
        background-size: 100%;
        background-position: bottom;
        transition: scale var(--tr), opacity var(--tr);
        background-repeat: no-repeat;
        opacity: 0;
        scale: 1.1;
    }
    .category.selected::after {
        scale: 1;
        opacity: 1;
    }
</style>
