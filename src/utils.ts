export const $ = (s: string): any => {
  let el = document.querySelector(s);
  if (!el) throw new Error('element not found');
  return el
}
export const $$ = (s: string) => document.querySelectorAll(s);


// https://stackoverflow.com/a/57518703
export const ord = (n: string) =>
  n +
  { e: "st", o: "nd", w: "rd", h: "th" }[
  new Intl.PluralRules("en", { type: "ordinal" }).select(parseInt(n))[2]
  ];

export const createElement = (tag: string, attrs: string, value?: string) => {
  // shorthand element function
  let el = document.createElement(tag);
  if (attrs)
    attrs.split(";").forEach((attr) => {
      if (!attr) return;
      let vals = attr.split(":");
      el.setAttribute(vals[0].trim(), vals[1].trim());
    });
  el.innerHTML = value || "";
  return el;
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const purify = (str: string) =>
  str
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("æ", "ae")
    .toLowerCase();

//https://stackoverflow.com/a/12646864
export function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function renderAnswer(str: string | string[]) {
  let res = createElement("span", "class:rendered-answer");

  str = str as string[];
  if (!(str instanceof Array)) str = Array(1).fill(str);

  str.forEach((answer, i) => {
    let [word, note] = answer.split("|");

    res.append(word);
    if (note)
      res.append(createElement("span", "class:answer-note", ` (${note})`));

    if (i !== (str ?? answer).length - 1) res.append(", ");
  });

  return res;
}

export const map = {
  "n": "neuter",
  "m": "masculine",
  "f": "feminine",
  "s": "singular",
  "p": "plural",
  "nom": "nominative",
  "gen": "genitive",
  "dat": "dative",
  "acc": "accusative",
  "abl": "ablative",
}
