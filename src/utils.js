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

export const purify = str => str.trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace('æ', 'ae')