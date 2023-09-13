<script lang="ts">
    import Multitoggle, {
        type MultitoggleItem,
    } from "@/components/Multitoggle.svelte";
    import { onMount } from "svelte";
    let dropdown: HTMLDivElement;
    onMount(() => {
        document.body.append(dropdown);
    });
    export let title: string;
    export let items: MultitoggleItem[];
    export let state: MultitoggleItem["value"][];
</script>

<div style="position: relative">
    <div class="select">
        <div class="select-title">{title}</div>
        <Multitoggle
            bind:multitoggleContainer={dropdown}
            bind:state
            {items}
            let:item
        >
            <div class="select-item" data-value={item.value}>{item.name}</div>
        </Multitoggle>
    </div>
</div>

<style>
    .select {
        padding: 7px 10px;
        background: var(--bg-l2);
        border-radius: var(--rad-m);
        border: 1px solid var(--border-light);
    }
    .select > :global(*:not(.select-title)) {
        position: absolute;
        top: 90%;
        min-width: 100%;
        left: 0;
        display: flex;
        flex-direction: column;
        padding: 7px;
        background: var(--bg-l2);
        border-radius: var(--rad-m);
        border: 1px solid var(--border-light);
        z-index: 2;
        box-shadow: var(--shadow-m);
        gap: 0;
    }
    .select-item {
        padding: 4px 6px;
        border-radius: var(--rad-s);
        margin: 0;
    }
    .select-item:hover {
        background: var(--bg-l3);
    }
</style>
