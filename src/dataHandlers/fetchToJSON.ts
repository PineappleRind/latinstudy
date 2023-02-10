export const fetchToJson = async (url: string) => {
    let data = await fetch(url).then((r) => r.json());
    return data;
}
