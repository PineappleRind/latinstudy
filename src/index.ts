import { Switcher, MultitoggleManager } from "./components/index.js";
import { Initializer } from "./quiz/index.js";
import { Loader } from "./view/index.js";
import { DataHandler } from "./dataHandlers/index.js";
import type { StudierData } from "@/types/data";

/**
 * Base Studier class.
 * Initializes all modules.
 */
export class Studier {
	multitoggleManager: MultitoggleManager;
	switcher: Switcher;
	quizInitializer: Initializer;
	viewLoader: Loader;
	data: StudierData = <StudierData>{};

	constructor() {
		this.multitoggleManager = new MultitoggleManager();
		this.switcher = new Switcher();

		this.quizInitializer = new Initializer();
		this.viewLoader = new Loader();

		this.initialize();
	}
	async initialize() {
		this.multitoggleManager.initialize();
		this.switcher.listen().showPane("begin");

		this.data = (await new DataHandler().initialize()).data;

		this.viewLoader.initialize(this.data);
		this.quizInitializer.initialize(this.data);
	}
}

declare global {
	interface Window {
		latinstudier: Studier;
	}
}

window.latinstudier = new Studier();
