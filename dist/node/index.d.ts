export interface ISearchParams {
    [key: string]: string | null;
}
export declare const parseQueryString: (search: string) => ISearchParams;
export declare const formatQueryString: (params: ISearchParams) => string;
export declare const sortKeys: (params: ISearchParams) => ISearchParams;
export declare const splitProtocol: (url: string) => [string, string];
export declare const splitHash: (url: string) => [string, string];
export declare const splitQuery: (url: string) => [string, string];
export declare const splitPath: (url: string) => [string, string];
export declare const prefix: (s: string, pre: string) => string;
export declare class URL {
    port: string;
    private _protocol;
    private _hostname;
    private _pathname;
    private _search;
    private _hash;
    constructor(url: string);
    protocol: string;
    hostname: string;
    host: string;
    origin: string;
    pathname: string;
    search: string;
    searchParams: ISearchParams;
    hash: string;
    href: string;
    readonly normalizedHref: string;
    addSearchParam(key: string, value: string): URL;
    sortSearch(): string;
}
