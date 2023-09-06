<script lang="ts">
    type MultitoggleItem = {
        name: string;
        value: string | number;
    };
    export let state: MultitoggleItem["value"][] = [];
    export let items: MultitoggleItem[];
    let itemElements: HTMLDivElement[] = [];

    function handleSelect(item: MultitoggleItem) {
        state.includes(item.value)
            ? (state = state.filter((i) => i !== item.value))
            : (state = [...state, item.value]);
        const index = items.findIndex((c) => item.value === c.value);
        const element = itemElements[index];
        element.style.animationPlayState = "running";
        element.onanimationend = () => {
            element.style.animationPlayState = "paused";
        };
    }
</script>

<div class="multitoggle">
    {#each items as item, index}
        <div
            class="multitoggle-option"
            bind:this={itemElements[index]}
            class:selected={state.includes(item.value)}
            on:click={() => handleSelect(item)}
            on:keydown={() => handleSelect(item)}
        >
            {item.name}
        </div>
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
        border: 1px solid var(--light-border);
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
