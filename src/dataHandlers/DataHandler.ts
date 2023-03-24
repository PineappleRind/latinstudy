import { JSONResource } from "./JSONResource.js";
import { parseEndingData } from "./parse/parseEndingData.js";

export class DataHandler {
  resources: JSONResource[];
  data: any[];

  async initialize() {
    this.resources = await Promise.all([
      new JSONResource(`/data/endings.json`, "endings").load(),
      new JSONResource(`/data/vocab.json`, "vocab").load()
    ]);
    this.data = [];

    let parsedEndings = parseEndingData(this.resources[0].json);
    this.data.push(parsedEndings, this.resources[1].json);

    return this;
  }
}