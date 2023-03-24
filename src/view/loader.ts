import { $, $$, createElement, renderAnswer } from "../utils.js";

export class Loader {
  pane: Element;
  options: { [x: string]: HTMLSelectElement };
  note: Element;
  vocabLoaded: boolean;
  trigger: Element;

  constructor() {
    this.pane = $(".pane#view");
    this.options = {
      type: $("#view-type"),
      declType: $("#view-declension-type"),
      vocabType: $("#view-vocab-type"),
    };
    // this.note = $(".view-note");
    this.trigger = $("#view-trigger");

    this.vocabLoaded = false;
  }

  async initialize(data) {
    // listen for view button clicks
    this.trigger.addEventListener("click", () =>
      this.update[this.options.type.value].apply(this, [data]));
    // listen for changes in select menus
    this.options.type.addEventListener('input', (e) => {
      let selectedType = (e.target as HTMLInputElement).value;

      // this.note.innerHTML = "";

      this.update[selectedType](data);
      // Hide and show elements according to which
      // e.target.value they're associated with
      Array.from($$("[data-view-association]")).forEach((el: HTMLElement) => {
        if (el.dataset.viewAssociation === selectedType)
          el.classList.remove("hidden");
        else el.classList.add("hidden");
      });
    });

    this.options.declType.oninput = (e) => {
      // $(".view-note").innerHTML = "";
      this.update[this.options.type.value](data);
    };
  }

  update = {
    declensions: ([{ declensions }]) => {
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
    vocab: ([_, vocab]) => {
      if (this.vocabLoaded === true) return;
      for (const voc of vocab) {
        // Exclude my JSON "comments"
        if (typeof voc === "string") continue;
        let word = createElement(
          "div",
          "class:view-vocab-word",
          `${voc.word}${voc.dictionary ? ", " + voc.dictionary : ""}`
        );
        word.dataset.declension = voc.declension || "0";
        word.dataset.type = voc.type || "other";
        word.append(renderAnswer(voc.translation));

        $(".view-vocab").append(word);
      }
      this.vocabLoaded = true;
    },
  };
}
