import { createElement, wait } from "../../utils.js";

type AnimatorSettings = {
	minWidth?: number;
	transitionDuration?: number;
};

/**
 * Animates the width and height of a container depending on its content.
 * Used by {@link WalkthroughMan}.
 */
export class Animator {
	/** Outer container. This container will be animated. */
	outer: HTMLElement;
	/** Inner container. This container will be measured, will store the content and its updates. */
	inner: HTMLElement;
	settings: AnimatorSettings;
	observer: MutationObserver;
	observerConfig: MutationObserverInit;

	/** Creates an {@link Animator.inner} container if one's not already there. */
	constructor(target: HTMLDivElement, settings: AnimatorSettings) {
		this.outer = target; // outer container.
		this.settings = settings;
		// set outer's content to inner
		this.inner = createElement("div", "class:animator-inner");
		this.outer.replaceChildren(this.inner);

		this.observer = new MutationObserver((mutationList) => {
			console.log(mutationList);
			this.animateTo(this.inner);
		});
		this.observerConfig = { childList: true, subtree: true };
	}

	/** Change {@link Animator.inner}'s content and animate {@link Animator.outer}'s width and height to fit it. */
	async animateTo(
		newHTML: HTMLElement,
		transitionDuration: number = 0,
		fade: boolean = false,
	) {
		// get dimensions
		const dimensions = this.getHTMLDimensions(newHTML);
		// Hide the container's contents
		if (fade) this.outer.classList.add("hidden");
		this.outer.style.width = `${Math.max(
			dimensions.width,
			this.settings.minWidth || 0,
		)}px`;
		this.outer.style.height = `${dimensions.height}px`;

		// Wait a bit
		if (transitionDuration) await wait(transitionDuration);
		// then replace the content and unhide
		this.inner.remove();
		this.outer.append(newHTML);
		this.inner = newHTML;

		if (fade) this.outer.classList.remove("hidden");
		// save current inner
		this.inner = newHTML;
		return newHTML;
	}

	async setInner(newHTML: HTMLElement) {
		// this.observer.disconnect();

		await this.animateTo(newHTML, this.settings.transitionDuration, true);
		this.observer.observe(this.inner, this.observerConfig);
	}

	/**
	 * Observe {@link Animator.inner}'s DOM mutations, calling {@link Animator.animateTo} if there are
	 */
	listen() {
		this.observer.observe(this.inner, this.observerConfig);
		return this;
	}
	/**
	 * Helper function to measure the dimensions of an element. We're usually measuring {@link Animator.inner}.
	 * @returns The dimensions of the element, in a DOMRect.
	 */
	getHTMLDimensions(html: HTMLElement): DOMRect {
		// Clone the node & measure it, basically
		html.classList.add("invisible");
		document.body.append(html);
		const size = html.getBoundingClientRect();
		html.classList.remove("invisible");
		html.remove();
		return size;
	}
}
