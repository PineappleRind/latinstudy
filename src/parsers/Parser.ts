/**
 * Abstraction for EndingParser and VocabParser.
 */
export abstract class Parser {
  data: any;
  past: any;

  id: string;
  constructor(data: object | object[], past: object) {
    this.data = data;
    this.past = past;
  }
  expand(data: any) {
    for (const abbr in data) {
      if (!this.maps[abbr]) continue;
      data[abbr] = this.maps[abbr][data[abbr]];
    }
    return data;
  }
  abstract parse(): any;

  maps = {
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
    }
  }
}