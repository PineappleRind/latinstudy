import { cubicOut, quadOut } from "svelte/easing";

export function scale(
	_node: HTMLElement,
	{ duration = 200, delay = 0, ease = quadOut },
) {
	return {
		duration,
		delay,
		css: (t: number) => {
			const eased = ease(1 - t);
			const computedScale = (1 - eased) * 0.03 + 0.97;
			return `opacity: ${t}; transform: scale(${computedScale})`;
		},
	};
}
