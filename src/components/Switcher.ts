import { $$ } from "../utils.js";

export class Switcher {
	panes: { [x: string]: HTMLElement };
	triggers: HTMLElement[];
	history: HTMLElement[];

	constructor() {
		this.panes = {};
		this.triggers = $$(".pane-trigger");
		this.history = [];
	}
	listen() {
		this.indexPanes();
		for (const trigger of this.triggers)
			trigger.addEventListener("click", () =>
				this.showPane(trigger.dataset.pane || ""),
			);
		return this;
	}
	indexPanes() {
		const indexed = {};
		for (const pane of $$(".pane")) indexed[pane.id] = pane;
		this.panes = indexed;
	}
	showPane(id: string) {
		let target = this.panes[id];
		if (id.startsWith(".")) target = this.history[1];
		if (!target) target = this.panes["404"];
		target.classList.add("showing");
		if (this.history[0]) this.history[0].classList.remove("showing");
		this.history.unshift(target);
		return this;
	}
}
