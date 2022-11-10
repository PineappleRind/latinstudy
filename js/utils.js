export const $ = (s, a) => document[`querySelector${a ? "All" : ""}`](s);

export const fetchToJSON = async (url) => {
    let data = await fetch(url).then(r => r.json());
    return data;
}

// https://stackoverflow.com/a/57518703
export const ord = n => n + { e: "st", o: "nd", w: "rd", h: "th" }[new Intl.PluralRules("en", { type: "ordinal" }).select(n)[2]]