import { JSONResource } from "./index.js";
import { parseEndingData, parseVocabData } from "./parse/index.js";
import { JSONEndingsData, VocabWord } from "./parse/types.js";
import { StudierData } from "./types.js";

export class DataHandler {
	resources: [JSONResource<JSONEndingsData>, JSONResource<VocabWord[]>];
	data: StudierData;

	async initialize() {
		this.resources = await Promise.all([
			new JSONResource<JSONEndingsData>("/data/endings.json", "endings").load(),
			new JSONResource<VocabWord[]>("/data/vocab.json", "vocab").load(),
		]);

		const parsedEndings = parseEndingData(this.resources[0].json);
		const parsedVocab = parseVocabData(this.resources[1].json);
		this.data = {
			...parsedEndings,
			vocab: parsedVocab
		};

		return this;
	}
}
