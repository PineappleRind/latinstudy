// https://stackoverflow.com/a/57518703
export const ord = (n: string) =>
	n +
	{ e: "st", o: "nd", w: "rd", h: "th" }[
		new Intl.PluralRules("en", { type: "ordinal" }).select(parseInt(n))[2]
	];
