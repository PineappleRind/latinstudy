export function filterForRoute(
	searchParams: URLSearchParams,
	data: Record<string, unknown>[],
) {
	return data.filter((x) => {
		const params = searchParams.entries();
		for (const [key, value] of params) {
			// yea... "keyof {}"... 😅
			if (x?.[key as keyof typeof x]?.toString() !== value) return false;
		}
		return true;
	});
}
