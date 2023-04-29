import { $$ } from "../utils.js";

type MultitoggleCallback = (group: string, values: string[]) => void;
type MultitoggleSubscription = { callback: MultitoggleCallback; group: string };
type MultitoggleGroup = { elements: HTMLElement[]; selected: string[] };
/**
 * Manage groups of buttons that can be
 * enabled and disabled individually.
 */
export class MultitoggleManager {
	groups: Record<string, MultitoggleGroup> = {};
	subscriptions: MultitoggleSubscription[] = [];
	public static instance: MultitoggleManager;

	constructor() {
		// Get and index all the buttons under their group.
		const buttons = $$("[data-multitoggle-group]");
		for (const button of buttons) {
			const group = button.dataset.multitoggleGroup;
			if (!group)
				throw new Error(
					`Multitoggle: Button with text "${button.innerText}" must be part of a group`,
				);

			this.groups[group] ??= { elements: [], selected: [] };
			this.groups[group].elements.push(button);
			button.dataset.multitoggleGroup = undefined;
		}

		MultitoggleManager.instance = this;
	}

	initialize() {
		for (const groupID in this.groups) {
			for (const button of this.groups[groupID].elements) {
				button.onclick = () => this.buttonEvent(button, groupID);
			}
		}
	}

	subscribeToGroup(group: string, callback: MultitoggleCallback) {
		if (!this.groups[group])
			throw new Error(`Multitoggle: group ${group} doesn't exist`);
		this.subscriptions.push({ group, callback });
	}

	buttonEvent(button: HTMLElement, groupID: string) {
		const { selected } = this.groups[groupID];

		const buttonValue = button.dataset.value;
		if (!buttonValue)
			throw new Error(
				`Multitoggle: Button in group ${groupID} must have a data-value`,
			);

		if (!selected.includes(buttonValue)) {
			button.classList.add("selected");
			this.groups[groupID].selected.push(buttonValue);
		} else {
			button.classList.remove("selected");

			this.groups[groupID].selected = selected.filter((b) => b !== buttonValue);
		}

		for (const { group: callbackGroup, callback } of this.subscriptions) {
			if (callbackGroup === groupID)
				callback(groupID, this.groups[groupID].selected);
		}
	}
}
