<script context="module" lang="ts">
export let openDropdown: [number, () => Promise<void>] | undefined = undefined;
export let uniqueId = 1;
</script>

<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { onMount } from "svelte";

    import Checkbox from "@/routes/quiz/settings/components/Checkbox.svelte";

    let dropdown: HTMLUListElement;
    let titleElement: HTMLDivElement;
    let id = uniqueId++;

    function recalculate() {
        const rect = titleElement.getBoundingClientRect();

        dropdown.style.left = rect.x + "px";
        dropdown.style.top = rect.bottom + "px";
        dropdown.style.minWidth = rect.width + "px";

        dropdown.dataset.isWiderThanTitle = (
            Math.sign(dropdown.clientWidth - rect.width) === 1
        ).toString();
    }
    window.addEventListener("resize", recalculate);

    onMount(async () => {
        // Make sure there's no item selected that the user can't see
        state = state.filter((x) => items.some((item) => item.value === x));

        document.body.append(dropdown);
        // wait until dom updates
        await new Promise((r) => setTimeout(r));
        recalculate();

        return () => {
            window.removeEventListener("resize", recalculate);
            dropdown.remove();
        };
    });
    beforeNavigate(() => {
        // make sure it's closed before we leave the page
        open = false;
    });

    type SelectItem = {
        name: string;
        value: string | number;
    };
    export let title: string;
    export let showSelected: boolean = true;
    export let items: SelectItem[];
    export let state: SelectItem["value"][];
    let open = false;

    async function onOpen(e: Event) {
        recalculate();

        const isArrowDown =
            e instanceof KeyboardEvent && e.code === "ArrowDown" && !open;

        if (isArrowDown || e instanceof MouseEvent) {
            open = !open;
            if (isArrowDown) {
                (
                    document
                        .getElementById(`selectContainer-${id.toString(16)}`)
                        ?.querySelector("[type=checkbox]") as HTMLElement
                )?.focus();
            }
        }
        // if we've just opened one, make sure the other one closes
        if (open && openDropdown?.[0] !== id) {
            await openDropdown?.[1]();

            openDropdown = [
                id,
                async () => {
                    open = false;
                },
            ];
        }
    }
    function onSelect(item: SelectItem) {
        if (state.includes(item.value))
            state = state.filter((x) => x !== item.value);
        else state = [...state, item.value];
    }
    function checkboxHandler(
        key: string,
        index: number,
        length: number,
        item: SelectItem,
    ) {
        function focus(n: number) {
            (
                document
                    .getElementById(`selectContainer-${id.toString(16)}-${n}`)
                    ?.querySelector("[type=checkbox]") as HTMLElement
            )?.focus();
        }
        if (key === "Escape") {
            titleElement.focus();
            open = false;
        } else if (key === "ArrowDown" && index + 1 >= length) focus(0);
        else if (key === "ArrowDown") focus(index + 1);
        else if (key === "ArrowUp" && index - 1 < 0) focus(length - 1);
        else if (key === "ArrowUp") focus(index - 1);
        else if (key === " ") onSelect(item);
    }
</script>

<div
    bind:this={titleElement}
    class:open
    role="combobox"
    aria-controls={`selectContainer-${id.toString(16)}`}
    aria-expanded={open}
    aria-haspopup="listbox"
    on:mousedown={onOpen}
    on:keydown={onOpen}
    class="select-title"
    tabindex="0"
>
    <div>
        <p>{title}</p>
        {#if showSelected}
            <p class="subtitle">{state.length} selected</p>{/if}
    </div>
    <div class="chevron" class:upside-down={open} />
</div>

<ul
    class="select-container"
    id={`selectContainer-${id.toString(16)}`}
    class:open
    aria-hidden={!open}
    bind:this={dropdown}
>
    {#each items as item, index}
        <li
            class="select-item"
            on:mouseup={() => onSelect(item)}
            on:keydown={({ key }) =>
                checkboxHandler(key, index, items.length, item)}
            data-value={item.value}
            id={`selectContainer-${id.toString(16)}-${index.toString(16)}`}
        >
            <p>{item.name}</p>
            <Checkbox
                tabindex={open ? null : "-1"}
                label={item.name}
                nointeractive
                selected={state.includes(item.value)}
            />
        </li>
    {/each}
</ul>

<style>
    .select-title {
        padding: 7px 10px;
        background: var(--bg-l1);
        border-radius: var(--rad-m);
        border: 1px solid var(--border-light);
        display: inline-flex;
        gap: 15px;
        align-items: center;
        justify-content: space-between;
        transition:
            border var(--tr),
            border-radius var(--tr),
            box-shadow var(--tr);
    }
    .select-title.open {
        border-bottom: 1px solid transparent;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        box-shadow: inset 0 -1px 3px rgba(0, 0, 0, 0.1);
    }
    .select-title p.subtitle {
        font-size: 0.8em;
        color: var(--txt-c2);
        font-variant-numeric: tabular-nums;
    }

    .select-container {
        position: absolute;
        display: flex;
        flex-direction: column;
        padding: 4px;
        background: var(--bg-l1);
        border-radius: var(--rad-m);
        border-top-left-radius: 0;
        border: 1px solid var(--border-light);
        z-index: 2;
        box-shadow: var(--shadow-m);
        gap: 0;
        opacity: 0;
        scale: 0.99;
        translate: 0 3px;
        pointer-events: none;
        transition:
            opacity var(--tr),
            scale var(--tr),
            translate var(--tr);
    }
    .select-container.open {
        opacity: 1;
        pointer-events: all;
        scale: 1;
        translate: 0 -1px;
    }
    :global(.select-container[data-is-wider-than-title="false"]) {
        border-top-right-radius: 0 !important;
    }
    .select-item {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        padding: 5px 10px;
        border-radius: var(--rad-s);
        margin: 0;
    }
    .select-item:hover {
        background: var(--bg-l3);
    }
    .chevron {
        --thickness: 1px;
        --size: 8px;
        border-right: var(--thickness) solid var(--txt-c1);
        border-bottom: var(--thickness) solid var(--txt-c1);
        rotate: 45deg;
        min-width: var(--size);
        min-height: var(--size);
        margin-top: -0.15em;
        transition:
            margin-top var(--tr),
            rotate var(--tr);
    }
    .chevron.upside-down {
        rotate: 225deg;
        margin-top: 0.2em;
    }
</style>
