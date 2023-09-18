export function filterForRoute(searchParams: URLSearchParams, data: unknown[]) {
	return data.filter((x) => {
		const params = searchParams.entries();
		for (const [key, value] of params) {
			// yea... "keyof {}"... 😅
			if (x?.[key as keyof {}] !== value) return false;
		}
		return true;
	});
}
