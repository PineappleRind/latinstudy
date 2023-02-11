let count = 0;

export default class JSONResource {
  url: string;
  id: string;
  json: any;

  constructor(url: string, id?: string) {
    this.url = url;
    this.id = id || (count++).toString(16);
  }

  async load() {
    if (!this.url) throw new Error("No url to load!");
    let req = await fetch(this.url)
    this.json = await req.json();
    
    return this;
  }
}
