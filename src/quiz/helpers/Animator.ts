import { createElement, wait } from "../../utils.js";

type AnimatorSettings = {
	minWidth: number;
	transitionDuration: number;
	padding: number;
};

// abstract class ContainerAnimatorAbstract {
// 	container: HTMLDivElement;
// 	settings: AnimatorSettings;

// 	constructor: (container: HTMLElement, settings: AnimatorSettings) => ContainerAnimator;
// 	append: (newElement: HTMLElement) => Promise<ContainerAnimator>;
// 	appendAfter: (toAppend: HTMLElement, after: HTMLElement) => ContainerAnimator;
// 	setContent: (newContent: DocumentFragment, fade?: boolean) => ContainerAnimator;

// 	resizeContainerToFit: (newContent: HTMLElement) => void;
// 	shiftDownAfter: (startElement: HTMLElement, amount: number) => Promise<void>;
// 	measureElement: (element: HTMLElement) => DOMRect;
// }
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
	/** Outer container. This container will be animated. */
	container: HTMLDivElement;
	settings: AnimatorSettings;

	/** Creates an {@link Animator.inner} container if one's not already there. */
	constructor(container: HTMLDivElement, settings: Partial<AnimatorSettings>) {
		this.container = container;
		this.settings = {
			minWidth: settings.minWidth || 0,
			transitionDuration: settings.transitionDuration || 200,
			padding: settings.padding || 0,
		};
	}

	/** Append an element to ${@link container | the container}, animating the container to fit it. */
	async append(newElement: HTMLElement): Promise<ContainerAnimator> {
		const { height, width } = this.measureElement(newElement);
		const { height: containerHeight, width: containerWidth } =
			this.measureElement(this.container);

		newElement.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: this.settings.transitionDuration,
		});
		await this.animateDimensionsTo({
			height: height + containerHeight,
			width: Math.max(width, containerWidth),
		});
		this.container.append(newElement);

		return this;
	}

	async setContent(
		newContent: DocumentFragment,
		fade?: boolean,
	): Promise<ContainerAnimator> {
		if (fade) {
			for (const child of Array.from(this.container.children))
				child.animate([{ opacity: 1 }, { opacity: 0 }], {
					duration: this.settings.transitionDuration,
				});
			await wait(this.settings.transitionDuration);
		}
		this.container.innerHTML = "";

		const dummy = createElement("div");
		dummy.append(newContent);

		const { height, width } = this.measureElement(dummy);

		await this.animateDimensionsTo({
			height: height + this.settings.padding,
			width,
		});

		this.container.append(...Array.from(dummy.children));

		return this;
	}

	async animateDimensionsTo(target: AnimateDimensionsTarget) {
		const finalKeyframe = {
			...(target.height && { height: `${target.height}px` }),
			...(target.width && { width: `${target.width}px` }),
		};
		console.log("animating to", finalKeyframe);
		const animation = this.container.animate([{}, finalKeyframe]);
		await animation.finished;

		if (target.height) this.container.style.height = `${target.height}px`;
		if (target.width) this.container.style.width = `${target.width}px`;
	}

	/**
	 * Helper function to measure the dimensions of an element
	 * @returns The dimensions of the element, in a DOMRect.
	 */
	measureElement(html: HTMLElement): DOMRect {
		const parent = html.parentNode;
		let index: number | null = null;
		if (parent) index = Array.from(parent.children).indexOf(html) || 1;

		document.body.append(html);
		const size = html.getBoundingClientRect();
		if (parent) parent.insertBefore(html, parent.children[index as number]);
		return size;
	}
}
