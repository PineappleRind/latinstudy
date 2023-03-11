import { JSONResource } from "./JSONResource.js";

export class DataHandler {
  resources: JSONResource[];
  data: any[];

  async initialize() {
    this.resources = await Promise.all([
      new JSONResource(`/data/endings.json`, "endings").load(),
      new JSONResource(`/data/vocab.json`, "vocab").load()
    ]);
    this.data = [];

    return this;
  }

  async parse() {
    // overwrite resources with parsed data
    for (const resource of this.resources) {
      let parsed = await this.parser.parse(resource)
      this.data.push(parsed)
    }

    return this.data;
  }
}