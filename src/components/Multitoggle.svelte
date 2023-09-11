<script lang="ts">
    import { onMount } from "svelte";

    type MultitoggleItem = {
        name: string;
        value: string | number;
    };
    export let min = 0;
    export let state: MultitoggleItem["value"][] = [];
    export let items: MultitoggleItem[];
    let multitoggleContainer: HTMLDivElement;
    let itemElements: HTMLDivElement[] = [];
    onMount(() => {
        itemElements = Array.from(
            multitoggleContainer.querySelectorAll(
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
        {#if !$$slots.default}
            <div
                data-multitoggle-option
                class="multitoggle-option"
                bind:this={itemElements[index]}
                class:selected={state.includes(item.value)}
                on:click={() => handleSelect(item)}
                on:keydown={() => handleSelect(item)}
            >
                {item.name}
            </div>
        {:else}
            <div data-multitoggle-option>
                <slot {handleSelect} {state} {item} />
            </div>
        {/if}
    {/each}
</div>

<style>
    .multitoggle {
        display: flex;
        flex-wrap: wrap;
        padding: 2px;
        gap: 2px;
    }
    .multitoggle-option {
        padding: 3px 6px;
        transition: var(--tr);
        cursor: pointer;
        min-width: 45px;
        text-align: center;
        border: 1px solid var(--border-light);
        border-radius: var(--rad-m);
        animation: multitoggle-shake var(--tr-l) paused;
    }
    .multitoggle-option.selected {
        background: var(--btn-bg);
        color: var(--txt-inv-c0);
        animation: scale-bigger var(--tr-l) paused;
    }
    @keyframes scale-bigger {
        50% {
            scale: 1.1;
            rotate: 2deg;
            box-shadow: 0 0 20px -3px rgba(43, 0, 255, 0.2);
        }
    }

    @keyframes multitoggle-shake {
        30% {
            translate: 2px 0px;
        }

        50% {
            translate: -2px 0px;
        }

        70% {
            translate: 0px 0px;
        }
    }
</style>
