interface QueryOptions {
    category: string;
    search: string;
    [param: string]: string;
}

export const createQueryString = (params: QueryOptions): string => {
    if (!params) return '';
    return Object.keys(params)
        .map((key) => {
            if (!params[key]) return '';
            return `${key}=${params[key]}`;
        })
        .join('&');
};

export const createUrl = (url: string, queryOptions?: QueryOptions): string =>
    url +
    (queryOptions ? `?${createQueryString(queryOptions as QueryOptions)}` : '');
