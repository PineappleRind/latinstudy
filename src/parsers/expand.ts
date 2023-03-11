import type { endingType, Declensions, Conjugations, Pronouns, JSONEndingData } from "./types";

/** Takes in EndingData and returns Declensions | Conjugations | Pronouns. 
* It extracts information from the key to convert it into an object. */
export function expandEndingData(data: JSONEndingData[keyof JSONEndingData], type: endingType): Declensions | Conjugations | Pronouns {
  let output = {};
  for (const number in data) {
    let group = data[number]
    for (let key in group) {
      let ending = group[key];
      let expanded = expandKey(ending[key].split("/"), type);
      output[number].push({ ending, ...expanded });
    }
  }
  return output;
}

function expandKey(data: string[], type: endingType) {
  let output = {};
  for (const [i, contraction] of data.entries()) {
    let currentType = types[type][i];
    let expansion = maps[currentType][contraction];
    if (!expansion) throw new Error(`Invalid key ${data.join("/")}! Could not find an expansion for ${contraction}.`)

    output[currentType] = expansion;
  }
  return output;
}

const types: { [x in endingType]: string[] } = {
  "declensions": ["gender", "number", "case"],
  "conjugations": ["voice", "mood", "tense", "number", "person"],
  "pronouns": ["gender", "number", "case"]
}

const maps = {
  "gender": {
    "m": "masculine",
    "f": "feminine",
    "n": "neuter"
  },
  "number": {
    "s": "singular",
    "p": "plural"
  },
  "case": {
    "nom": "nominative",
    "gen": "genitive",
    "dat": "dative",
    "acc": "accusative",
    "abl": "ablative"
  },
  "voice": {
    "a": "active",
    "p": "passive"
  },
  "mood": {
    "i": "indicative",
    "im": "imperative"
  },
  "tense": {
    "pre": "present",
    "imp": "imperfect",
    "fut": "future"
  }
}
