export const fetchData = async <Response>(
    endpoint: string
): Promise<Response> => {
    const config: RequestInit = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        const res = await fetch(endpoint, config);
        const data = await res.json();
        if (res.ok) {
            return data;
        }
        throw new Error(res.statusText);
    } catch (err: any) {
        return Promise.reject(err.message);
    }
};
