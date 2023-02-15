import { createElement, wait } from "../../utils.js";

type AnimatorSettings = {
  minWidth?: number
}

export class Animator {
  outer: any;
  settings: AnimatorSettings;
  inner: HTMLElement;

  constructor(target: HTMLDivElement, settings: AnimatorSettings) {
    this.outer = target; // outer container.
    this.settings = settings;
    // set outer's content to inner
    this.inner = createElement("div", "class:animator-inner");
    this.outer.replaceChildren(this.inner);
  }
  animateTo(newHTML: HTMLElement, delay: number) {
    // get dimensions
    let dimensions = this.getHTMLDimensions(newHTML);
    // Hide the container's contents 
    this.outer.classList.add("hidden");
    this.outer.style.width = `${Math.max(dimensions.width, this.settings.minWidth || 0)}px`;
    this.outer.style.height = `${dimensions.height}px`;

    return new Promise((resolve) => {
      // Wait a bit
      wait(delay).then(() => {
        // then replace the content and unhide
        this.outer.replaceChild(newHTML, this.inner);
        this.outer.classList.remove("hidden");
        // save current inner
        this.inner = newHTML;
        resolve(newHTML);
      });
    });
  }

  animateAppend(toappend: HTMLElement) {
    // create a clone and add the element
    let clone = this.inner.cloneNode(true) as HTMLElement;
    clone.append(toappend);
    // get hypothetical dimensions and update outer
    let dimensions = this.getHTMLDimensions(clone);
    this.outer.style.width = `${dimensions.width}px`;
    this.outer.style.height = `${dimensions.height}px`;
    // append the content
    this.inner.append(toappend);
  }

  getHTMLDimensions(html: HTMLElement) {
    // Clone the node & measure it, basically
    html.classList.add("invisible");
    document.body.append(html);
    let size = html.getBoundingClientRect();
    html.classList.remove("invisible");
    html.remove();
    return size;
  }
}
