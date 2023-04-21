import { $, createElement, wait } from "../utils.js";

const typeMap: string[] = ["info", "success", "error"];
const queue: Message[] = [];
let showing: boolean = false;
let id: number = 0;
const container: HTMLElement = createElement("div", "class:toast-container");

$("#app").append(container);

export default class Message {
	el: HTMLElement;
	duration: number;
	id: string;

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

		this.el = el;
		this.duration = duration;
		this.id = (id++).toString(16);
		// Add it to the queue
		queue.push(this);
		// Call the manager 😡
		wantToShow();
	}
}

function wantToShow() {
	if (!queue.length) return;
	if (showing) return setTimeout(wantToShow, queue[0].duration);
	showMessage(queue[0]).then(() => {
		queue.shift();
		showing = false;
		wantToShow();
	});
}

async function showMessage({ el, duration }) {
	container.append(el);
	showing = true;
	await wait(duration);
	el.classList.add("hidden");
	await wait(200);
	el.remove();
	return;
}
