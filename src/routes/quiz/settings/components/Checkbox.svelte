<script lang="ts">
export let selected: boolean;
export let label: string;
export const nointeractive = false;
export const showLabel = false;
function interruptSelect(e: KeyboardEvent) {
	if (nointeractive) e.preventDefault();
}
</script>

<label>
    <span class="checkbox" class:selected>
        <input
            {...$$restProps}
            type="checkbox"
            class="hidden-checkbox"
            on:keydown={interruptSelect}
            bind:checked={selected}
            aria-label={label}
        />
    </span>
    {#if showLabel}
        {label}
    {/if}
</label>

<style>
    .hidden-checkbox {
        appearance: none;
        width: 18px;
        height: 18px;
    }

    .checkbox {
        display: inline-block;
        width: 18px;
        height: 18px;
        vertical-align: text-top;
        border: 1px solid var(--border-light);
        border-radius: var(--rad-s);
        position: relative;
        transition: background-color var(--tr);
    }
    .checkbox::after {
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
        transition:
            opacity var(--tr),
            scale var(--tr);
    }
    .checkbox.selected {
        background: var(--btn-bg);
    }
    .checkbox.selected::after {
        opacity: 1;
        scale: 1;
    }
    .label {
        margin-left: 0.1em;
    }
</style>
