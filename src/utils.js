export const $ = (s, a) => document[`querySelector${a ? "All" : ""}`](s);

export const fetchToJSON = async (url) => {
  let data = await fetch(url).then((r) => r.json());
  return data;
};

// https://stackoverflow.com/a/57518703
export const ord = (n) =>
  n +
  { e: "st", o: "nd", w: "rd", h: "th" }[
  new Intl.PluralRules("en", { type: "ordinal" }).select(n)[2]
  ];

export const createElement = (tag, attrs, value) => {
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

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const purify = (str) =>
  str
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("æ", "ae")
    .toLowerCase();

//https://stackoverflow.com/a/12646864
export function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function renderAnswer(str) {
  let res = createElement("span", "class:rendered-answer");
  const process = (str, answer, i) => {
    let broken = answer.split("|");
    let word = broken[0],
      note = broken[1];

    res.append(word);
    if (note)
      res.append(createElement("span", "class:answer-note", `(${note})`));

    if (i !== (str ?? answer).length - 1) res.append(", ");
  };

  if (str.constructor === Array) str.forEach((a, i) => process(str, a, i));
  else process("", str, -1);

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