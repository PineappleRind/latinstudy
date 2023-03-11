import { expandEndingData } from "../expand.js";
import type { endingType, JSONEndingData, ParsedEndingsData } from "../types";

export function parseEndingData(data: JSONEndingData) {
  let expanded: ParsedEndingsData = <any>{};
  for (const type in data) {
    expanded[type] = expandEndingData(data[type], type as endingType);
  }
}