import { $, createElement, wait } from "../utils.js";

const typeMap: string[] = ["info", "success", "error"];
const queue: Message[] = [];
let showing: boolean = false;
let id: number = 0;
const container: HTMLElement = createElement("div", "class:toast-container");

$("#app").append(container);

export default class Message {
  el: HTMLElement;
  duration: any;
  id: string;

  constructor(content: string, type: number, duration: number, title?: string) {
    // Create a message
    const el = createElement("div", `class:toast ${typeMap[type]}`);
    if (title) el.append(createElement("h3", "class:toast-header", title));
    el.append(
      createElement(
        "p",
        `class:toast-description ${title ? "smaller" : ""}`,
        content
      )
    );

    this.el = el;
    this.duration = duration
    this.id = (id++).toString(16);
    // Add it to the queue
    queue.push(this);
    // Call the manager 😡
    wantToShow();
  }
}

function wantToShow() {
  if (!queue.length) return;
  if (showing) return setTimeout(wantToShow, queue[0].duration)
  showMessage(queue[0]).then(() => {
    queue.shift();
    showing = false;
    wantToShow();
  });
}

function showMessage({ el, duration }) {
  return new Promise<void>(async (r) => {
    container.append(el);
    showing = true;
    await wait(duration);
    el.classList.add("hidden");
    wait(200).then(() => {
      el.remove();
      r();
    });
  });
}
