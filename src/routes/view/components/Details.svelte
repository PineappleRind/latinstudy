<script lang="ts">
let open = false;
function handleOpen() {
	open = !open;
}
</script>

<div class="details" class:open>
    <div
        class="details-trigger"
        on:click={handleOpen}
        on:keydown={(e) => e.code === "Space" && handleOpen()}
    >
        <div class="details-marker" />
        <slot name="summary" />
    </div>
    <div class="details-content-wrapper">
        <div class="details-content">
            <slot />
        </div>
    </div>
</div>

<style>
    .details :global(.details) {
        margin-left: 1em;
    }
    .details {
        align-items: center;
        cursor: default;
    }
    .details-marker {
        width: 0.5em;
        height: 0.5em;
        border-left: 1.5px solid black;
        border-bottom: 1.5px solid black;
        rotate: -0.375turn;
        margin-right: 0.5rem;
        transition: rotate var(--tr-l), translate var(--tr-l);
        translate: 0px 0;
    }
    .details.open > .details-trigger > .details-marker {
        rotate: -0.125turn;
        translate: 2px 0;
    }
    .details-trigger {
        display: flex;
        align-items: center;
    }
    .details-content-wrapper {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows var(--tr-l);
    }
    .details.open > .details-content-wrapper {
        grid-template-rows: 1fr;
    }
    .details-content {
        min-height: 0px;
        overflow: hidden;
    }
</style>
