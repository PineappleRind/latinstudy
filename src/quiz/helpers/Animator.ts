import { createElement, wait } from "../../utils.js";

type AnimatorSettings = {
	minWidth: number;
	transitionDuration: number;
	padding: number;
	easing: string;
};

type RequireAtLeastOne<T> = {
	[K in keyof T]: { [L in K]: T[L] } & { [L in Exclude<keyof T, K>]?: T[L] };
}[keyof T];

type AnimateDimensionsTarget = RequireAtLeastOne<{
	height: number;
	width: number;
}>;

/**
 * Animates the width and height of a container depending on its content.
 * Used by {@link WalkthroughMan}.
 */
export class ContainerAnimator {
	/** This container will be animated. It will contain the content container. */
	wrapper: HTMLDivElement;
	/** This container will only hold the content. */
	container: HTMLDivElement;
	settings: AnimatorSettings;
	currentContainerDimensions?: DOMRect;

	/** Creates an {@link Animator.inner} container if one's not already there. */
	constructor(
		wrapper: HTMLDivElement,
		container: HTMLDivElement,
		settings: Partial<AnimatorSettings>,
	) {
		this.wrapper = wrapper;
		this.container = container;
		this.container.dataset.animatorContainer = "";
		this.settings = {
			minWidth: settings.minWidth || 0,
			transitionDuration: settings.transitionDuration || 400,
			padding: settings.padding || 0,
			easing: settings.easing || "ease",
		};
	}

	/** Append an element to ${@link container | the container}, animating the container to fit it. */
	async append(newElement: HTMLElement): Promise<ContainerAnimator> {
		const { height, width } = this.measureElement(newElement);
		const { height: containerHeight, width: containerWidth } =
			this.currentContainerDimensions ||
			this.measureElement(this.container, this.wrapper);

		await this.animateDimensionsTo({
			height: height + containerHeight,
			width: Math.max(width, containerWidth) - this.settings.padding,
		});

		this.container.append(newElement);
		const anim = newElement.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: this.settings.transitionDuration,
		});
		await anim.finished;
		return this;
	}

	async setContent(
		newContent: DocumentFragment,
		fade?: boolean,
	): Promise<ContainerAnimator> {
		const dummy = createElement(
			"div",
			"class=animator-outer quiz-content;style=max-width:fit-content;data-animator-container=",
		);
		dummy.append(newContent);

		const { height, width } = this.measureElement(dummy, this.wrapper);

		this.animateDimensionsTo({
			height: height + this.settings.padding,
			width: width - this.settings.padding,
		});

		if (fade) {
			this.container.classList.add("hidden");
			for (const child of Array.from(this.container.children))
				child.animate([{ opacity: 1 }, { opacity: 0 }], {
					duration: this.settings.transitionDuration,
				});
		}
		await wait(this.settings.transitionDuration);
		this.container.innerHTML = "";

		this.container.append(...Array.from(dummy.children));
		this.container.classList.remove("hidden");

		return this;
	}

	async animateDimensionsTo(target: AnimateDimensionsTarget) {
		const finalKeyframe = {
			...(target.height && { height: `${target.height}px` }),
			...(target.width && { width: `${target.width}px` }),
		};
		console.log("animating to", finalKeyframe);
		const animation = this.wrapper.animate([{}, finalKeyframe], {
			duration: this.settings.transitionDuration,
			easing: this.settings.easing,
		});
		await animation.finished;

		if (target.height) this.wrapper.style.height = `${target.height}px`;
		if (target.width) this.wrapper.style.width = `${target.width}px`;

		return 0;
	}

	/*
	just some cases to help wrap our heads around this
	  * Case: a parent is specified, meaning the
	  * element does not exist in the DOM, but
	  * will be appended to the parent.
	  * Result: element is appended to the parent,
	  * measured, then removed.
	  * 
	  * Case: a parent isn't specified, meaning
	  * it doesn't matter where the element is 
	  * measured from
	  * Result: element is appended to document.body
	  * then measured, then removed.
	  */
	/**
	 * Helper function to measure the dimensions of an element
	 * @returns The dimensions of the element, in a DOMRect.
	 */
	measureElement(html: HTMLElement, parent?: HTMLElement): DOMRect {
		const el = <HTMLElement>html.cloneNode(true);
		el.classList.add("invisible");

		if (!parent) document.body.append(el);
		else parent.append(el);

		const size = el.getBoundingClientRect();
		// debugger;
		el.classList.remove("invisible");
		// debugger;
		el.remove();
		if (el.dataset.animatorContainer) this.currentContainerDimensions = size;
		return size;
	}
}
