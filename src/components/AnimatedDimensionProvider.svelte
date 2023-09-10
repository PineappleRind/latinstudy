<script lang="ts">
    import { page } from "$app/stores";
    import { scale } from "@/routes/animations";
    import { quadIn } from "svelte/easing";

    export let key: unknown;
    let animator: HTMLDivElement;
    let contentDimensions: DOMRectReadOnly;
    let dimensionsCSS: string;

    $: {
        if (contentDimensions) {
            dimensionsCSS = `width: ${contentDimensions.width}px; height: ${contentDimensions.height}px`;
            animator.ontransitionstart = () =>
                animator.classList.add("animating");
            animator.ontransitionend = () =>
                animator.classList.remove("animating");
        }
    }
</script>

<div style={dimensionsCSS} bind:this={animator} class="content-wrapper">
    {#key key}
        <div
            in:scale|local={{ delay: 200, ease: quadIn }}
            out:scale|local={{
                duration: $page.route.id?.includes("active") ? 200 : 0,
            }}
            bind:contentRect={contentDimensions}
            class="content-animator"
        >
            <slot />
        </div>
    {/key}
</div>

<style>
    .content-wrapper {
        transition: width 0.4s, height 0.4s;
        position: relative;
        overflow: hidden;
    }
    :global(.content-wrapper:has(.animating)) {
        transition: 0s all !important;
    }
    .content-animator {
        width: max-content;
        min-width: 300px;
        position: absolute;
    }
</style>
