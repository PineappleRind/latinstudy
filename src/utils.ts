export const $ = (s: string) => {
	const el = document.querySelector<HTMLElement>(s);
	if (!el) throw new Error("element not found");
	return el;
};
export const $$ = (s: string) =>
	Array.from(document.querySelectorAll<HTMLElement>(s));

// https://stackoverflow.com/a/57518703
export const ord = (n: string) =>
	n +
	{ e: "st", o: "nd", w: "rd", h: "th" }[
		new Intl.PluralRules("en", { type: "ordinal" }).select(parseInt(n))[2]
	];

export const createElement = <T extends HTMLElement = HTMLElement>(
	tag: string,
	attrs: string,
	value?: string,
) => {
	// shorthand element function
	const el = document.createElement(tag) as T;
	if (attrs)
		attrs.split(";").forEach((attr) => {
			if (!attr) return;
			const vals = attr.split(":");
			el.setAttribute(vals[0].trim(), vals[1].trim());
		});
	el.innerHTML = value || "";
	return el;
};

export const wait = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const purify = (str: string) =>
	str
		.trim()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace("æ", "ae")
		.toLowerCase();

//https://stackoverflow.com/a/12646864
export function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

export function renderAnswer(str: string | string[]) {
	const res = createElement("span", "class:rendered-answer text-subtle");

	str = str as string[];
	if (!(str instanceof Array)) str = Array(1).fill(str);

	str.forEach((answer, i) => {
		const [word, note] = answer.split("|");

		res.append(word);
		if (note)
			res.append(createElement("span", "class:answer-note text-subtler", ` (${note})`));

		if (i !== (str ?? answer).length - 1) res.append(", ");
	});

	return res;
}
