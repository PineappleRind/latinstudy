let count = 0;
/**
 * Fetches the specified URL and returns it as JSON.
 */
export class JSONResource<T> {
	url: string;
	/** A unique ID for tagging purposes. */
	id: string;
	json: T;

	constructor(url: string, id?: string) {
		this.url = url;
		this.id = id || (count++).toString(16);
	}
	/** Does the actual work I said above. */
	async load() {
		if (!this.url) throw new Error("No url to load!");
		const req = await fetch(this.url);
		this.json = await req.json();

		return this;
	}
}
