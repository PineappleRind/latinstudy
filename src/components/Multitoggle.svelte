<script lang="ts" context="module">
    export type MultitoggleItem = {
        name: string;
        value: string | number;
    };
</script>

<script lang="ts">
    import { onMount } from "svelte";

    export let min = 0;
    export let state: MultitoggleItem["value"][] = [];
    export let items: MultitoggleItem[];
    export let multitoggleContainer: HTMLDivElement | undefined = undefined;
    let itemElements: HTMLDivElement[] = [];
    onMount(() => {
        itemElements = Array.from(
            multitoggleContainer?.querySelectorAll(
                "[data-multitoggle-option]"
            ) || []
        );
    });

    const removeFromState = (value: MultitoggleItem["value"]) => {
        state = state.filter((i) => i !== value);
    };
    const addToState = (value: MultitoggleItem["value"]) => {
        // reassign array so svelte knows
        state = [...state, value];
    };
    function handleSelect(item: MultitoggleItem) {
        const index = items.findIndex((c) => item.value === c.value);
        if (state.includes(item.value)) {
            console.log(index, itemElements);
            if (state.length <= min)
                return (itemElements[index].style.animation =
                    "multitoggle-shake 0.2s both running");
            removeFromState(item.value);
        } else addToState(item.value);
        const element = itemElements[index];
        element.style.animationPlayState = "running";
        element.onanimationend = () => {
            element.style.animationPlayState = "paused";
        };
    }
</script>

<div bind:this={multitoggleContainer} class="multitoggle">
    {#each items as item, index}
        <div data-multitoggle-option>
            <slot {handleSelect} {state} {item} />
        </div>
    {/each}
</div>

<style>
    .multitoggle {
        display: flex;
        flex-wrap: wrap;
        padding: 2px;
        gap: 2px;
        max-width: 100%;
    }
    [data-multitoggle-option] {
        display: contents;
    }
</style>
