import type { endingType } from "./types";

export function expandKey(data: string[], type: endingType) {
  let output: Record<keyof typeof maps, string> = {} as any;
  for (const [i, contraction] of data.entries()) {
    let currentType = types[type][i];
    if (contraction === "-") {
      output[currentType] = contraction;
      continue;
    }
    let expanded = maps[currentType][contraction];
    if (!expanded) throw new Error(`Invalid key ${data.join("/")}! Could not find an expansion for ${contraction}.`)

    output[currentType] = expanded;
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
