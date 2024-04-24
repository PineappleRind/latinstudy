<script lang="ts">
import { afterNavigate, beforeNavigate } from "$app/navigation";
import { page } from "$app/stores";
import { quadIn } from "svelte/easing";
import { scale } from "./animations";
import { previousPage } from "./stores";

let backlink: { url: string; name: string } | null = null;

let unique = {};
beforeNavigate(() => {
	unique = {};
});
afterNavigate(({ from }) => {
	if ($page.data.backlink) backlink = $page.data.backlink;
	else if ($page.url.pathname !== "/") backlink = { url: "/", name: "Home" };
	else backlink = null;

	previousPage.set(from?.url?.pathname || $previousPage);
});
</script>

<main>
    {#key unique}
        <div
            in:scale|global={{ duration: 300, ease: quadIn }}
            out:scale|global={{ duration: 300 }}
            class="pane-wrap"
        >
            {#if backlink}
                <a class="link back" href={backlink.url}>{backlink.name}</a>
                <br />
            {/if}
            <div class="pane"><slot /></div>
        </div>
    {/key}
</main>

<footer>
    LatinStudier™ v<span id="version">{APP_VERSION}</span> |
    <a class="link" href="https://github.com/pineapplerind/latinstudy">GitHub</a>
    | by <a class="link" href="https://pineapplerind.xyz">PineappleRind</a>
</footer>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100vw;
        height: 100vh;
    }
    .pane-wrap {
        position: absolute;
    }
    .pane {
        transition: var(--tr-l) all;
        padding: 20px;
        max-width: min(500px, 100vw);
        min-width: 300px;
        max-height: min(700px, 70vh);
        overflow-y: auto;
        box-shadow: var(--shadow-l);
        border-radius: 20px;
        translate: 0px 1px;
        border: 1px solid var(--border-light);
        background: var(--bg-l0);
    }
    @supports (scrollbar-gutter: stable) {
        .pane {
            scrollbar-gutter: stable;
            padding: 20px 5px 20px 20px;
        }
    }

    footer {
        position: fixed;
        bottom: 10px;
        text-align: center;
        width: 100vw;
        color: var(--txt-c2);
        font-size: 14px;
        z-index: 2;
    }

    footer a {
        color: var(--txt-c2);
        font-size: 1em;
        text-decoration: underline;
    }

    footer a:hover {
        color: var(--txt-c1);
    }
</style>
