import { StudierData } from "../dataHandlers/types.js";
import { $, $$, createElement, renderAnswer, purify } from "../utils.js";

export class Loader {
	pane: Element;
	options: { [x: string]: HTMLSelectElement };
	note: Element;
	vocabLoaded: boolean;
	trigger: Element;
	data: StudierData;

	constructor() {
		this.pane = $(".pane#view");
		this.options = {
			type: $("#view-type") as HTMLSelectElement,
			declType: $("#view-declension-type") as HTMLSelectElement,
			vocabType: $("#view-vocab-type") as HTMLSelectElement,
		};
		// this.note = $(".view-note");
		this.trigger = $("#view-trigger");
	}

	async initialize(data: StudierData) {
		this.data = data;
		// listen for view button clicks
		this.trigger.addEventListener("click", () =>
			this.load[this.options.type.value].apply(this, [data]),
		);

		this.options.type.addEventListener("input", this.events.selectedType);
		Object.entries(this.options).forEach(([_, el]) => {
			el.addEventListener("input", () =>
				this.load[this.options.type.value](data),
			);
		});
	}

	events = {
		selectedType(e: InputEvent) {
			const selectedType = (e.target as HTMLInputElement).value;
			// this.note.innerHTML = "";
			// Hide and show elements according to which
			// e.target.value they're associated with
			Array.from($$("[data-view-association]")).forEach((el: HTMLElement) => {
				if (el.dataset.viewAssociation === selectedType)
					el.classList.remove("hidden");
				else el.classList.add("hidden");
			});
		},
	};

	load = {
		declensions: ({ declensions }) => {
			const selectedDeclension = declensions[this.options.declType.value];
			// store Set of genders (every element is unique)
			// this is used to determine the genders that
			// *aren't* part of the current declension and hide them accordingly
			const genders: Set<string> = new Set();
			for (const ending of selectedDeclension) {
				$(
					`.view-table-field.${ending.gender}.${ending.number}.${ending.case}`,
				).textContent = ending.ending;

				genders.add(ending.gender);
			}
			// show every gender
			$$(".view-table-head, .view-table-field").forEach(
				(e) => (e.style.display = "table-cell"),
			);
			// hide every gender that isn't part of the declension
			const genderArray: string[] = Array.from(genders);
			$$(
				`.view-table-head:not(.${genderArray.join(
					"):not(.",
				)}), .view-table-field:not(.${genderArray.join("):not(.")})`,
			).forEach((e) => ((e as HTMLTableElement).style.display = "none"));
		},
		vocab: ({ vocab }) => {
			$(".view-vocab").innerHTML = "";
			vocab = vocab.sort((a, b) => (purify(a.word) > purify(b.word) ? 1 : -1));
			for (const word of vocab) {
				// Exclude words that are filtered out
				if (
					this.options.vocabType.value !== "*" &&
					word.type !== this.options.vocabType.value
				)
					continue;
				const listItem = createElement(
					"div",
					"class:view-vocab-word",
					`${word.word}${word.dictionary ? `, ${word.dictionary}` : ""}`,
				);
				listItem.dataset.declension = word.declension || "0";
				listItem.dataset.type = word.type || "other";
				listItem.append(renderAnswer(word.translation));

				$(".view-vocab").append(listItem);
			}
			this.vocabLoaded = true;
		},
	};
}
