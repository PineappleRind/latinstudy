import { $, createElement, wait } from "../utils.js";

const typeMap = ["info", "success", "error"];
let lastShown = Date.now();

/** A toast popup component used for info messages, successes, or errors. */
export class Message {
	element: HTMLElement;
	duration: number;
	Manager: MessageManager = MessageManager.instance;

	constructor(content: string, type: number, duration: number, title?: string) {
		// Create a message
		const el = createElement("div", `class:toast ${typeMap[type]}`);
		if (title) el.append(createElement("h3", "class:toast-header", title));
		el.append(
			createElement(
				"p",
				`class:toast-description ${title ? "smaller" : ""}`,
				content,
			),
		);

		this.element = el;
		this.duration = duration;
	}

	async show() {
		if (Date.now() - lastShown < 200) return; // no spam thanks
		lastShown = Date.now();
		await this.Manager.showMessage(this);
		return this;
	}
}

/**
 * Manages the message queue, and removes the oldest messages if the total message count overflows MAX_QUEUE_LENGTH.
 *
 * We don't export this as it's managed directly by {@link Message}.
 */
class MessageManager {
	/** Where messages will appear */
	#container: HTMLDivElement;
	#queue: Message[] = [];
	/** We don't want more than one MessageManager active at once */
	public static instance: MessageManager = new MessageManager();
	static readonly MAX_QUEUE_LENGTH = 5;
	static readonly MESSAGE_PADDING = 4;

	/** Create a message container, hopefully only once */
	private constructor() {
		const container: HTMLDivElement = createElement(
			"div",
			"class:toast-container",
		);
		$("#app").append(container);
		this.#container = container;
	}

	async showMessage(message: Message) {
		this.#queue.push(message);
		const overflow = this.#queue.length - MessageManager.MAX_QUEUE_LENGTH;
		for (let i = 0; i < overflow; i++) this.removeTopMessage();
		this.#container.append(message.element);
		this.animateContainerUp(message);
		await wait(message.duration);
		this.removeTopMessage();
	}

	async removeTopMessage() {
		const message = this.#queue.shift();
		if (!message) return;
		message.element.classList.add("hidden");
		await wait(200); // Transition length
		message.element.remove();
	}

	/** Animate all messages up when a message appears to make the UI smoother and less confusing */
	async animateContainerUp(message: Message) {
		const newMessageHeight =
			MessageManager.MESSAGE_PADDING +
			message.element.getBoundingClientRect().height;
		this.#container.style.bottom = `-${newMessageHeight}px`;
		// skip an event loop
		await wait(0);

		this.#container.style.transition = "0.2s";
		this.#container.style.bottom = "0px";
		await wait(200);
		this.#container.style.transition = "0s";
	}
}
