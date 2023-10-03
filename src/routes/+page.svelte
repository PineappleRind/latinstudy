<!-- interested in the code? check out /build/ts/index.js OR the GitHub: -->
<!-- https://github.com/pineapplerind/latinstudy -->
<!-- https://github.com/pineapplerind/latinstudy -->
<script lang="ts">
    import AnimatedSprite from "@/components/AnimatedSprite.svelte";

    const spriteSize = 100;
</script>

<div>
    <h2>LatinStudier™</h2>
    <p style="text-wrap: balance; max-width: 300px;">
        Study helper for vocabulary, declension, and conjugation endings
    </p>
</div>
<div class="flex" style="gap: 0px">
    <a class="home-link" href="/view">
        <AnimatedSprite
            style="margin-inline: -20px; margin-top: -10px;"
            size={spriteSize}
            url=""
        />
        <p>Learn</p></a
    >
    <a class="home-link" href="/quiz/settings/categories">
        <AnimatedSprite
            style="margin-inline: -20px; margin-top: -10px;"
            size={spriteSize}
            url="/sprites/quiz.webp"
        />
        <p>Quiz</p>
    </a>
    <a class="home-link" href="/config">
        <AnimatedSprite
            style="margin-inline: -20px; margin-top: -10px; scale: 0.9;"
            size={spriteSize}
            url="/sprites/gear.webp"
        />
        <p>Configure</p>
    </a>
</div>

<style>
    .home-link {
        padding: 20px;
        min-width: 100px;
        width: 100%;
        border-radius: var(--rad-l);
        background: transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        /* box-shadow: 0 0 20px var(--bg-l0);*/
    }
    .home-link p {
        text-align: center;
        font-weight: 600;
        font-size: 1.2rem;
        color: var(--txt-c1);
    }
    .home-link:hover {
        background: var(--bg-l1);
    }
</style>
