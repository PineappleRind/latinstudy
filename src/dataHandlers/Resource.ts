export default class Resource {
  url: string;
  id: any;

  constructor(url: string, id: any) {
    this.url = url;
    this.id = id;
  }

  load(): Promise<any> {
    if (!this.url) throw new Error("No url to load!");
    return new Promise((resolve) => {
      fetch(this.url)
        .then(response => response.json())
        .then(jsoned => {
          resolve(jsoned);
        });
    });
  }
}
