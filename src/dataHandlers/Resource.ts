let count = 0;

export default class Resource {
  url: string;
  id: any;

  constructor(url: string, id?: any) {
    this.url = url;
    this.id = id || (count++).toString(16);
  }

  async load() {
    if (!this.url) throw new Error("No url to load!");
    let req = await fetch(this.url)
    let json = await req.json();
    return json;
  }
}
