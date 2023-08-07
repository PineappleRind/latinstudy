export const purify = (str: string) =>
	str
		.trim()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace("æ", "ae")
		.toLowerCase();
