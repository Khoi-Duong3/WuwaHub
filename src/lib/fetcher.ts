import type { Fetcher } from 'swr';

const fetcher: Fetcher<any, string> = (url: string) =>
    fetch(url).then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
    });

export default fetcher;