import { StudierData } from "../dataHandlers/types.js";
import { $, $$, createElement, renderAnswer } from "../utils.js";

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
      type: $("#view-type"),
      declType: $("#view-declension-type"),
      vocabType: $("#view-vocab-type"),
    };
    // this.note = $(".view-note");
    this.trigger = $("#view-trigger");
  }

  async initialize(data: StudierData) {
    this.data = data;
    // listen for view button clicks
    this.trigger.addEventListener("click", () =>
      this.load[this.options.type.value].apply(this, [data]));

    this.options.type.addEventListener("input", this.events.selectedType, false);
    Object.entries(this.options).forEach(([_, el]) => {
      el.addEventListener("input", this.load[this.options.type.value].bind(this, data), false);
    })
  }

  events = {
    selectedType(e: InputEvent) {
      let selectedType = (e.target as HTMLInputElement).value;
      // this.note.innerHTML = "";
      // Hide and show elements according to which
      // e.target.value they're associated with
      Array.from($$("[data-view-association]")).forEach((el: HTMLElement) => {
        if (el.dataset.viewAssociation === selectedType)
          el.classList.remove("hidden");
        else el.classList.add("hidden");
      })
    }
  }

  load = {
    declensions: ({ declensions }) => {
      let selectedDeclension = declensions[this.options.declType.value];
      // store Set of genders (every element is unique)
      // this is used to determine the genders that
      // *aren't* part of the current declension and hide them accordingly
      let genders: Set<string> = new Set();
      for (const ending of selectedDeclension) {
        $(`.view-table-field.${ending.gender}.${ending.number}.${ending.case}`)
          .textContent = ending.ending;

        genders.add(ending.gender);
      }
      // show every gender
      Array.from($$(`.view-table-head, .view-table-field`) as NodeListOf<HTMLTableElement>).forEach(
        (e) => (e.style.display = "table-cell")
      );
      // hide every gender that isn't part of the declension
      let genderArray: string[] = Array.from(genders);
      Array
        .from($$(`.view-table-head:not(.${genderArray.join("):not(.")}), .view-table-field:not(.${genderArray.join("):not(.")})`))
        .forEach((e) => ((e as HTMLTableElement).style.display = "none"));
    },
    vocab: ({ vocab }) => {

      for (const word of vocab) {
        // Exclude words that are filtered out
        let listItem = createElement(
          "div",
          "class:view-vocab-word",
          `${word.word}${word.dictionary ? ", " + word.dictionary : ""}`
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
