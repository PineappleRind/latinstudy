<script lang="ts">
    import { onMount } from "svelte";

    const SPRITE_RESOLUTION = 480;
    const SPRITE_SHEET_LAYOUT = [20, 4];
    const SPRITE_SHEET_DIMENSIONS = SPRITE_SHEET_LAYOUT.map(
        (x) => x * SPRITE_RESOLUTION
    );

    export let url: string;
    export let style: string = "";
    export let size = 100;
    export let enterFunction: (i: number) => number = (i) => {
        return 1;
    };
    export let leaveFunction: (i: number) => number = () => {
        // Are we closer to the end or the beginning?
        if (i > 40) return 0;
        return -1;
    };

    let sheet: HTMLDivElement;
    let i = 0,
        hover: boolean;
    onMount(() => {
        sheet.onmouseenter = () => {
            hover = true;
            const delta = enterFunction(i);
            frame(delta);
        };
        sheet.onmouseleave = () => {
            hover = false;
            const delta = leaveFunction(i);
            frame(delta);
        };
        recalculatePosition();
    });
    async function frame(delta: number) {
        i += delta;
        recalculatePosition();
        if (i >= 80 && hover) return (i = 0);
        else if (i >= 80) i = 0;
        const playingForward = delta === 1 && hover === true;
        const playingBackward = delta === -1 && hover === false;
        if (i >= 0 && (playingForward || playingBackward || i > 40)) {
            await new Promise((x) => setTimeout(x, 20));
            requestAnimationFrame(frame.bind(this, delta));
        }
    }
    function recalculatePosition() {
        const row = i;
        const col = Math.floor(i / 20);
        console.log(row, col);
        // figure out how to scale element dimensions to sprite size
        const scale = [
            SPRITE_SHEET_DIMENSIONS[0] / (SPRITE_RESOLUTION / 4 / size),
            SPRITE_SHEET_DIMENSIONS[1] / (SPRITE_RESOLUTION / 4 / size),
        ];
        sheet.style.backgroundPosition = `${scale[0] - row * size}px ${
            scale[1] - col * 100
        }px`;
    }
</script>

<div
    class="sprite"
    style={`
    --dimensions:${size}px;
    --background-size-x:${14400 / (720 / size)}px;
    --background-size-y: ${2880 / (720 / size)}px;
    --url:url(${url});
    ${style}`}
    bind:this={sheet}
/>

<style let:url>
    .sprite {
        background-image: var(--url);
        transition: scale 0.4s;
        height: var(--dimensions);
        width: var(--dimensions);
        background-size: var(--background-size-x) var(--background-size-y);
        -webkit-mask-image: url("data:image/svg+xml,%3Csvg preserveAspectRatio='none' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0' y='0' viewBox='0 0 100 100' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .blur %7B filter: url(%23softedge); %7D %3C/style%3E%3Cfilter id='softedge'%3E%3CfeGaussianBlur stdDeviation='3.5'%3E%3C/feGaussianBlur%3E%3C/filter%3E%3Cg class='blur'%3E%3Crect x='10' y='10' width='80' height='80' /%3E%3C/g%3E%3C/svg%3E");
        -webkit-mask-size: 120% 120%;
        -webkit-mask-position: center;
    }
</style>
