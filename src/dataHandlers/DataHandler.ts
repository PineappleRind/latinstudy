import { JSONResource } from "./index.js";
import { parseEndingData, parseVocabData } from "./parse/index.js";
import type { JSONEndingsData, VocabWord } from "@/types/parsedData";
import type { StudierData } from "@/types/data";

/** 
 * Array of data we currently require for the Studier. 
*/
type dataResources = [JSONResource<JSONEndingsData>, JSONResource<VocabWord[]>];

export class DataHandler {
	resources: dataResources | null = null;
	data: StudierData = <StudierData>{};

	async initialize() {
		this.resources = await Promise.all([
			new JSONResource<JSONEndingsData>("/data/endings.json", "endings").load(),
			new JSONResource<VocabWord[]>("/data/vocab.json", "vocab").load(),
		]);

		if (this.resources.some(x => !x.json)) {
			alert("Fatal error: Failed to fetch data");
			throw new Error("Failed to fetch data!");
		}

		const parsedEndings = parseEndingData(this.resources[0].json as JSONEndingsData);
		const parsedVocab = parseVocabData(this.resources[1].json as VocabWord[]);
		this.data = {
			...parsedEndings,
			vocab: parsedVocab,
		};

		return this;
	}
}
