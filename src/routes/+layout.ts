import type { ParsedEndingsData, VocabWord } from "@/types/data";
import { derived, get } from "svelte/store";
import { maxLesson } from "./stores";

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
	const data = (await objectPromise(requests)) as ParsedEndingsData & {
		vocabulary: VocabWord[];
	};

	maxLesson.set(
		data.vocabulary.reduce(
			(prev, cur) => (prev < cur.lesson ? (prev = cur.lesson) : prev),
			0,
		),
	);

	const enabledEndingProperties = derived(maxLesson, (values, set) => {
		const eligibleEndings = [
			...data.conjugations,
			...data.declensions,
			...data.pronouns,
		].filter((a) => a.lesson <= get(maxLesson));
	});
	return data;
}
