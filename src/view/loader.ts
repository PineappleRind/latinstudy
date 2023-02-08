import { $, $$, createElement, map, renderAnswer } from "../utils.js";

export default class Loader {
  pane: Element;
  options: { type: HTMLSelectElement; declType: HTMLSelectElement; };
  note: Element;
  tables: { decl: HTMLTableElement; vocab: HTMLTableElement; };
  vocabLoaded: boolean;
  trigger: Element;

  constructor() {
    this.pane = $(".pane#view");
    this.options = {
      type: $("#view-type"),
      declType: $("#view-declension-type"),
    };
    this.note = $(".view-note");
    this.tables = {
      decl: $(".view-decl") as HTMLTableElement,
      vocab: $(".view-vocab") as HTMLTableElement,
    };
    this.trigger = $("#view-trigger");

    this.vocabLoaded = false;
  }

  async initialize(data) {
    // listen for view button clicks
    this.trigger.addEventListener("click", (e) =>
      this.update[this.options.type.value].apply(this, [data]));
    // listen for changes in select menues
    this.options.type.addEventListener('input', (e) => {
      let selectedType = (e.target as HTMLInputElement).value;

      this.note.innerHTML = "";
      this.options.declType.classList.toggle("hidden");

      this.update[selectedType](data);
      // Hide and show tables according to e.target.value
      Object.entries(this.tables).forEach(([_, table]) => {
        console.log(selectedType, table.dataset.type);
        if (selectedType === table.dataset.type)
          table.style.display = "block";
        else table.style.display = "none";
      });
    });

    this.options.declType.oninput = (e) => {
      $(".view-note").innerHTML = "";
      this.update[this.options.type.value](data);
    };
  }

  update = {
    declensions: ([{ declensions }]) => {
      let selectedDeclension = declensions[this.options.declType.value];
      // store Set of genders (every element is unique)
      // this is used to determine the genders that
      // *aren't* part of the current declenison and hide them accordingly
      let genders: Set<string> = new Set();
      for (const [key, ending] of Object.entries(selectedDeclension)) {
        let [gender, gnumber, $case] = key.split("|");
        if (key === "note") {
          $("#view-note").innerHTML = ending;
          continue;
        }
        $(`.view-table-field.${map[gender]}.${map[gnumber]}.${map[$case]}`)
          .textContent = ending;

        genders.add(gender);
      }
      // expand all contractions in the genders set
      genders = new Set(Array.from(genders).map((n: string) => map[n]));
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
