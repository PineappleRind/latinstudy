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
		}
	}

	/** Append an element to ${@link container | the container}, animating the container to fit it. */
	async append(newElement: HTMLElement): Promise<ContainerAnimator> {
		const { height } = this.measureElement(newElement);
		const { height: containerHeight } = this.measureElement(this.container);

		this.container.append(newElement);

		newElement.animate([{ opacity: 0 }, { opacity: 1 }], { duration: this.settings.transitionDuration });
		this.container.animate([{}, { height: height + containerHeight }])

		return this;
	}

	async setContent(newContent: DocumentFragment, fade?: boolean): Promise<ContainerAnimator> {
		if (fade) {
			for (const child of Array.from(this.container.children))
				child.animate([{ opacity: 1 }, { opacity: 0 }], { duration: this.settings.transitionDuration });
			await wait(this.settings.transitionDuration);
		};

		const dummy = createElement("div");
		dummy.append(newContent);
		const { height } = this.measureElement(dummy);
		const { height: containerHeight } = this.measureElement(this.container);

		await this.animateHeightTo(height + containerHeight + this.settings.padding);

		this.container.append(newContent);
		console.log(this.container,newContent.children)
		return this;
	}

	async animateHeightTo(height: number) {
		const animation = this.container.animate([{}, { height: `${height}px` }]);
		await animation.finished;
		this.container.style.height = `${height}px`;
	}

	/**
	 * Helper function to measure the dimensions of an element
	 * @returns The dimensions of the element, in a DOMRect.
	 */
	measureElement(html: HTMLElement): DOMRect {
		document.body.append(html);
		const size = html.getBoundingClientRect();
		html.remove();
		return size;
	}
}
