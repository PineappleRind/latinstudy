import { cubicOut, quadOut } from "svelte/easing";

export function scale(_node: HTMLElement, { delay = 0, ease = quadOut }) {
	return {
		duration: 300,
		delay,
		css: (t: number) => {
			const eased = ease(1 - t);
			const computedScale = (1 - eased) * 0.03 + 0.97;
			console.log(computedScale);
			return `opacity: ${t}; transform: scale(${computedScale})`;
		},
	};
}
