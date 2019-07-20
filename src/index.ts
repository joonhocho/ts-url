export interface ISearchParams {
  [key: string]: string | null;
}

export const parseQueryString = (search: string): ISearchParams => {
  const params: ISearchParams = {};
  if (search.length > 1) {
    (search
      .substring(1)
      .split('&')
      .map((x) => {
        if (x) {
          const i = x.indexOf('=');
          if (i === -1) {
            return [x, null];
          }
          return [x.substring(0, i), x.substring(i + 1)];
        }
        return null;
      })
      .filter((x) => x) as Array<[string, string | null]>).forEach(([k, v]) => {
      params[k] = v;
    });
  }
  return params;
};

export const formatQueryString = (params: ISearchParams): string => {
  const keys = Object.keys(params);
  return keys.length
    ? `?${keys
        .map((k) => {
          const v = params[k];
          return v == null ? k : `${k}=${v}`;
        })
        .join('&')}`
    : '';
};

const compareKeys = (a: string, b: string): number => a.localeCompare(b);

export const sortKeys = (params: ISearchParams): ISearchParams => {
  const copy: ISearchParams = {};
  const keys = Object.keys(params).sort(compareKeys);
  for (let i = 0, len = keys.length; i < len; i += 1) {
    const key = keys[i];
    copy[key] = params[key];
  }
  return copy;
};

const protocolRegex = /^(\w+:)\/\//;
const startingDoubleSlash = /^\/\//;
const portRegex = /:(\d+)$/;
const startingSlash = /^\/+/;
const endingSlash = /\/+$/;

export const splitProtocol = (url: string): [string, string] => {
  const match = url.match(protocolRegex);
  if (match) {
    const protocol = match[1];
    return [protocol, url.substring(protocol.length)];
  }
  return ['', url];
};

export const splitHash = (url: string): [string, string] => {
  const i = url.lastIndexOf('#');
  if (i === -1) {
    return [url, ''];
  }
  return [url.substring(0, i), url.substring(i)];
};

export const splitQuery = (url: string): [string, string] => {
  const i = url.lastIndexOf('?');
  if (i === -1) {
    return [url, ''];
  }
  return [url.substring(0, i), url.substring(i)];
};

export const splitPath = (url: string): [string, string] => {
  const i = url.indexOf('/');
  if (i === -1) {
    return [url, ''];
  }
  return [url.substring(0, i), url.substring(i)];
};

export const prefix = (s: string, pre: string): string =>
  s ? (s.charAt(0) === pre ? s : `${pre}${s}`) : '';

export class URL {
  public port = '';
  private _protocol = '';
  private _hostname = '';
  private _pathname = '';
  private _search = '';
  private _hash = '';

  constructor(url: string) {
    if (url) {
      this.href = url;
    }
  }

  get protocol(): string {
    return this._protocol;
  }

  set protocol(protocol: string) {
    this._protocol = protocol.toLowerCase();
  }

  get hostname(): string {
    return this._hostname;
  }

  set hostname(hostname: string) {
    this._hostname = hostname.toLowerCase();
  }

  get host(): string {
    const { _hostname, port } = this;
    return port ? `${_hostname}:${port}` : _hostname;
  }

  set host(host: string) {
    const portMatch = host.match(portRegex);
    if (portMatch) {
      this.hostname = host.substring(0, portMatch.index);
      this.port = portMatch[1];
    } else {
      this.hostname = host;
      this.port = '';
    }
  }

  get origin(): string {
    const { _protocol, host } = this;
    if (_protocol || host) {
      return `${_protocol}//${host}`;
    }
    return '';
  }

  set origin(origin: string) {
    let rest = origin;

    let protocol: string;
    [protocol, rest] = splitProtocol(rest);
    this.protocol = protocol;

    this.host = rest.replace(startingSlash, '').replace(endingSlash, '');
  }

  get pathname(): string {
    return this._pathname;
  }

  set pathname(pathname: string) {
    this._pathname = prefix(pathname, '/');
  }

  get search(): string {
    return this._search;
  }

  set search(search: string) {
    this._search = prefix(search, '?');
  }

  get searchParams(): ISearchParams {
    return parseQueryString(this._search);
  }

  set searchParams(params: ISearchParams) {
    this._search = formatQueryString(params);
  }

  get hash(): string {
    return this._hash;
  }

  set hash(hash: string) {
    this._hash = prefix(hash, '#');
  }

  get href(): string {
    return `${this.origin}${this._pathname}${this._search}${this._hash}`;
  }

  set href(href: string) {
    let rest = href;

    let hash: string;
    [rest, hash] = splitHash(rest);
    this._hash = hash;

    let search: string;
    [rest, search] = splitQuery(rest);
    this._search = search;

    let protocol: string;
    [protocol, rest] = splitProtocol(rest);
    this.protocol = protocol;

    if (startingDoubleSlash.test(rest)) {
      rest = rest.substring(2);

      const [host, pathname] = splitPath(rest);
      this.host = host;
      this._pathname = pathname;
    } else {
      this.host = '';
      this.pathname = rest;
    }
  }

  get normalizedHref(): string {
    return `${this.origin}${this._pathname}${formatQueryString(
      sortKeys(this.searchParams)
    )}${this._hash}`;
  }

  public setSearchParam(key: string, value: string | null): URL {
    const { searchParams } = this;
    if (searchParams[key] !== value) {
      searchParams[key] = value;
      this.searchParams = searchParams;
    }
    return this;
  }

  public setSearchParams(params: ISearchParams): URL {
    if (Object.keys(params).length) {
      this.searchParams = Object.assign(this.searchParams, params);
    }
    return this;
  }

  public removeSearchParam(key: string): URL {
    const { searchParams } = this;
    if (searchParams.hasOwnProperty(key)) {
      delete searchParams[key];
      this.searchParams = searchParams;
    }
    return this;
  }

  public sortSearch(): string {
    return (this._search = formatQueryString(sortKeys(this.searchParams)));
  }

  public clone(): URL {
    const clone = new URL('');
    clone.port = this.port;
    clone._protocol = this._protocol;
    clone._hostname = this._hostname;
    clone._pathname = this._pathname;
    clone._search = this._search;
    clone._hash = this._hash;
    return clone;
  }
}
