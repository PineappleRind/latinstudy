import { $, createElement, map, renderAnswer } from "../utils.js";

export default class Loader {
    constructor() {
        this.pane = $(".pane#view");
        this.options = {
            type: $("#view-type"),
            declType: $("#view-declension-type"),
        };
        this.vocabLoaded = false;
    }

    async initialize(data) {
        // listen for view button clicks
        $("#view-trigger").onclick = (e) =>
            this.update[this.options.type.value].apply(this, [data]);
        // listen for changes in select menues
        this.options.type.oninput = (e) => {
            this.options.declType.classList.toggle("hidden");
            this.update[e.target.value](data);
            $('.view-decl').style.display = (e.target.value === 'vocab' ? 'none' : 'block');
            $('.view-vocab').style.display = (e.target.value !== 'vocab' ? 'none' : 'block')
        };

        this.options.declType.oninput = (e) => {
            this.update[this.options.type.value](data);
        };

       // this.options.vocabSort.oninput = e => this.vocabSort(e.target.value);
    }

    update = {
        declensions: ([declensions]) => {
            let cur = declensions[this.options.declType.value];
            let genders = new Set();
            for (const [key, ending] of Object.entries(cur)) {
                let [gender, gnumber, $case] = key.split("|");
                if (key === "note") {
                    $("#view-note").innerHTML = ending;
                    continue;
                }
                $(`.view-table-field.${map[gender]}.${map[gnumber]}.${map[$case]}`).textContent = ending;

                genders.add(gender);
            }
            // expand all contractions
            genders = Array.from(genders).map((n) => map[n]);
            // show every gender
            Array.from($(`.view-table-head, .view-table-field`, 1)).forEach(
                (e) => (e.style.display = "table-cell")
            );
            // hide every gender that isn't part of the declension
            Array.from(
                $(`.view-table-head:not(.${genders.join("):not(.")}), 
                    .view-table-field:not(.${genders.join("):not(.")})`, 1)
            ).forEach((e) => (e.style.display = "none"));
        },
        vocab: ([_declensions, vocab]) => {
            if (this.vocabLoaded === true) return;
            for (const voc of vocab) {
                let word = createElement('div', 'class:view-vocab-word', `${voc.word}${voc.dictionary ? ', ' + voc.dictionary : ''}`);
                word.dataset.declension = voc.declension || "0";
                word.dataset.type = voc.type || "other";
                word.append(renderAnswer(voc.translation))

                $('.view-vocab').append(word);
            }
        //    this.vocabSort('type');
            this.vocabLoaded = true;
        }
    };

    //vocabSort(by) {
      //  let words = $()
    //}
}
