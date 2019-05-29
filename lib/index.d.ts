export interface ISearchParams {
    [key: string]: string | null;
}
export declare const parseQueryString: (search: string) => ISearchParams;
export declare const formatQueryString: (params: ISearchParams) => string;
export declare const splitProtocol: (url: string) => [string, string];
export declare const splitHash: (url: string) => [string, string];
export declare const splitQuery: (url: string) => [string, string];
export declare const splitPath: (url: string) => [string, string];
export declare class URL {
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    constructor(url: string);
    host: string;
    origin: string;
    searchParams: ISearchParams;
    addSearchParam(key: string, value: string): URL;
    sortSearch(): string;
    href: string;
    readonly normalizedHref: string;
}
