<script lang="ts">
    export let selected: boolean;
</script>

<div class="checkbox" class:selected />

<style>
    .checkbox {
        width: 18px;
        height: 18px;
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
        transition: opacity var(--tr), scale var(--tr);
    }
    .checkbox.selected {
        background: var(--btn-bg);
    }
    .checkbox.selected::after {
        opacity: 1;
        scale: 1;
    }
</style>
