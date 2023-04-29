import { $$ } from "../utils.js";

/**
 * Manage the showing and hiding of panes on clicks of `pane-trigger`s
 */
export class Switcher {
	panes: { [paneID: string]: HTMLDivElement };
	triggers: HTMLElement[];
	/** Store a history of pane IDs */
	history: string[];

	static readonly MAX_PANES_IN_HISTORY = 5;

	constructor() {
		this.panes = {};
		this.triggers = $$(".pane-trigger");
		this.history = [];
	}
	/**
	 * Index panes and add events to all `data-pane-trigger`s.
	 */
	listen() {
		this.indexPanes();
		for (const trigger of this.triggers)
			trigger.addEventListener("click", () =>
				this.showPane(trigger.dataset.pane || ""),
			);
		return this;
	}
	/**
	 * All elements with class `.pane` will be indexed and added to the {@link panes} object.
	 */
	indexPanes() {
		const indexed = {};
		for (const pane of $$(".pane")) {
			pane.setAttribute("tabindex", "-1");
			indexed[pane.id] = pane;
		}
		this.panes = indexed;
	}
	/**
	 * Transitions from the currently showing pane to a specified pane.
	 * @param id The pane ID to switch to.
	 */
	showPane(id: string) {
		const current = this.panes[this.history[0]];
		let target = this.panes[id];
		if (id.startsWith("..")) target = this.panes[this.history[1]];
		if (!target) target = this.panes["404"];

		target.classList.add("showing");
		target.removeAttribute("tabindex");
		if (current) {
			current.setAttribute("tabindex", "-1");
			current.classList.remove("showing");
		}

		this.history.unshift(target.id || "");
		if (this.history.length > Switcher.MAX_PANES_IN_HISTORY)
			this.history = this.history.slice(0, Switcher.MAX_PANES_IN_HISTORY);
	}
}
