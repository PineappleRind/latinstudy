export const ssr = false;

const objectZip = (keys: string[], values: unknown[]) =>
	keys.reduce(
		(others: Record<string, unknown>, key: string, index) => ({
			...others,
			[key]: values[index],
		}),
		{},
	);

const objectPromise = async (obj: Record<string, unknown>) =>
	objectZip(Object.keys(obj), await Promise.all(Object.values(obj)));

export async function load() {
	const requests = {
		conjugations: fetch("/api/conjugation-endings").then((a) => a.json()),
		declensions: fetch("/api/declension-endings").then((a) => a.json()),
		pronouns: fetch("/api/pronouns").then((a) => a.json()),
		vocabulary: fetch("/api/vocab").then((a) => a.json()),
	};
	const promise = await objectPromise(requests);

	return promise;
}
