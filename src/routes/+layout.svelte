<script lang="ts">
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import { quadIn } from "svelte/easing";
    import { scale } from "./animations";
    import { previousPage } from "./stores";

    let unique = {};
    beforeNavigate(() => (unique = {}));

    afterNavigate(({ from }) => {
        previousPage.set(from?.url?.pathname || $previousPage);
    });
</script>

<header>
    LatinStudier™ v<span id="version">0.1</span> |
    <a href="https://github.com/pineapplerind/latinstudy">GitHub</a>
    | by <a href="https://pineapplerind.xyz">PineappleRind</a>
</header>

<main>
    {#key unique}
        <div in:scale={{ ease: quadIn }} out:scale={{}} class="pane">
            <slot />
        </div>
    {/key}
</main>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100vw;
        height: 100vh;
    }

    .pane {
        position: absolute;
        transition: var(--tr-l) all;
        padding: 20px 10px;
        max-width: min(500px, 100vw);
        min-width: 300px;
        max-height: min(700px, 70vh);
        overflow-y: auto;
        box-shadow: var(--shadow-l);
        border-radius: 20px;
        translate: 0px 1px;
        border: 1px solid var(--border-light);
        background: var(--bg-l1);
        scrollbar-gutter: stable both-edges;
    }

    header {
        position: fixed;
        top: 10px;
        text-align: center;
        width: 100vw;
        color: var(--txt-c2);
        font-size: 14px;
        z-index: 2;
    }

    header a {
        color: var(--txt-c2);
    }

    header a:hover {
        color: var(--txt-c1);
    }
</style>
