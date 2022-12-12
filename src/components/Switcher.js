import { $ } from "../utils.js";

export default class Switcher {
  constructor() {
    this.panes = $(".pane", 1);
    this.triggers = $(".pane-trigger", 1);
    this.history = [];
    return this;
  }
  listen() {
    this.indexPanes();
    for (const trigger of this.triggers)
      trigger.addEventListener("click", () =>
        this.showPane(trigger.dataset.pane)
      );
    return this;
  }
  indexPanes() {
    let indexed = {};
    for (const pane of this.panes) indexed[pane.id] = pane;
    this.panes = indexed;
  }
  showPane(id) {
    let target = this.panes[id];
    if (id.startsWith(".")) target = this.history[1];
    if (!target) target = this.panes["404"];
    target.classList.add("showing");
    if (this.history[0]) this.history[0].classList.remove("showing");
    this.history.unshift(target);
    return this;
  }
}
