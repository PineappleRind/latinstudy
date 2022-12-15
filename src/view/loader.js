
import { $ } from "../utils.js";

export default class Loader {
    constructor() {
        this.pane = $('.pane#view');
    }
    async initialize(data) {
        // listen for view button clicks
        $('#view-trigger').onclick = this.load.bind(this, data);
    }

    load() {

    }
}