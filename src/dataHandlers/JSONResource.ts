let count = 0;
/**
 * Fetches the specified URL and returns it as JSON.
 */
export class JSONResource {
  url: string;
  /** A unique ID for tagging purposes. */
  id: string;
  json: any;

  constructor(url: string, id?: string) {
    this.url = url;
    this.id = id || (count++).toString(16);
  }
  /** Does the actual work I said above. */
  async load() {
    if (!this.url) throw new Error("No url to load!");
    let req = await fetch(this.url)
    this.json = await req.json();
    
    return this;
  }
}
