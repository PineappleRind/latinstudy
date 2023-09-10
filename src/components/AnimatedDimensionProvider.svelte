<script lang="ts">
    import { page } from "$app/stores";
    import { scale } from "@/routes/animations";
    import { quadIn } from "svelte/easing";
    import { onMount } from "svelte";

    export let key: unknown;
    let animator: HTMLDivElement;
    let contentDimensions: DOMRectReadOnly;
    let lastDimensions: DOMRectReadOnly;
    let dimensionsCSS: string;
    // If this reaches 10 frames of sub-30 pixel
    // movement, transitions will be disabled until
    // there are at least 2 frames of 0-pixel movement.
    let transitionCounter: number = 0;

    function movement(): number {
        return dist(
            lastDimensions?.width || contentDimensions.width,
            lastDimensions?.height || contentDimensions.height,
            contentDimensions.width,
            contentDimensions.height
        );
    }
    function dist(x1: number, y1: number, x2: number, y2: number): number {
        const a = x1 - x2;
        const b = y1 - y2;
        return Math.hypot(a, b);
    }
    onMount(() => {
        animator.ontransitionend = (e) =>
            console.log(
                e.propertyName,
                e.elapsedTime,
                e.currentTarget.innerText.slice(0, 20)
            );
    });
    $: {
        // this whole schtick with transitionCounter is to avoid
        // the consequences of nested AnimatedDimensionProvider
        async function loop(depth: number = 0) {
            if (!contentDimensions || depth > 1) return;
            // if we're almost done the transition
            if (movement() <= 0.4 && transitionCounter > 1)
                transitionCounter -= 2;
            if (transitionCounter >= 3) animator.classList.add("no-transition");
            else if (transitionCounter < 3)
                animator.classList.remove("no-transition");

            if (transitionCounter < 3 && movement() < 30 && movement() > 0)
                transitionCounter++;
            dimensionsCSS = `width: ${contentDimensions.width}px; height: ${contentDimensions.height}px`;
            lastDimensions = contentDimensions;
            await new Promise((r) => setTimeout(r, 10));
            loop(depth + 1);
        }
        loop(0);
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
    :global(.no-transition) {
        transition: 0s all !important;
    }

    .content-animator {
        width: max-content;
        min-width: 300px;
        position: absolute;
    }
</style>
