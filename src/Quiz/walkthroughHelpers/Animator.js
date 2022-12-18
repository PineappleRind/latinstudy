import { createElement, wait } from "../../utils.js";

export default class Animator {
  constructor(target, settings) {
    this.outer = target; // outer
    this.settings = settings;

    let possibleInner = this.outer.querySelector('.animator-inner');
    if (possibleInner) possibleInner.remove();

    this.inner = createElement("div", "class:animator-inner");
    this.outer.append(this.inner);
  }
  animateTo(html, delay) {
    // get dimensions
    let dimensions = this.getHTMLDimensions(html);
    // Hide the container's contents and prepare it for the next content
    this.outer.classList.add("hidden");
    this.outer.style.width = `${Math.max(dimensions.width, this.settings.minWidth || 0)}px`;
    this.outer.style.height = `${dimensions.height}px`;

    return new Promise((resolve) => {
      // Wait a bit
      wait(delay).then(() => {
        // then replace the content and unhide
        this.outer.replaceChild(html, this.inner);
        this.outer.classList.remove("hidden");
        // save current inner
        this.inner = html;
        resolve(html);
      });
    });
  }

  animateAppend(toappend, delay) {
    // create a clone and add the element
    let clone = this.inner.cloneNode(true);
    clone.append(toappend);
    // get hypothetical dimensions and update outer
    let dimensions = this.getHTMLDimensions(clone);
    this.outer.style.width = `${dimensions.width}px`;
    this.outer.style.height = `${dimensions.height}px`;
    // append the content
    this.inner.append(toappend);
  }

  getHTMLDimensions(html) {
    // Clone the node & measure it
    html.classList.add("invisible");
    document.body.append(html);
    let size = html.getBoundingClientRect();
    html.classList.remove("invisible");
    html.remove();
    return size;
  }
}
