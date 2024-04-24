// https://stackoverflow.com/a/57518703
export const ord = (n: string) =>
	n +
	{ e: "st", o: "nd", w: "rd", h: "th" }[
		new Intl.PluralRules("en", { type: "ordinal" }).select(
			Number.parseInt(n),
		)[2]
	];

export const capitalize = (str: string) =>
	str
		.split(" ")
		.map((s) => s.toUpperCase()[0] + s.slice(1))
		.join(" ");
