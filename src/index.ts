export interface ISearchParams {
  [key: string]: string | null;
}

export const parseQueryString = (search: string): ISearchParams => {
  const params: ISearchParams = {};
  ((search[0] === '?' ? search.substring(1) : search)
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
    .filter((x) => x) as Array<[string, string | null]>)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([k, v]) => {
      params[k] = v;
    });
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

export class URL {
  public protocol = '';
  public hostname = '';
  public port = '';
  public pathname = '';
  public search = '';
  public hash = '';

  constructor(url: string) {
    this.href = url;
  }

  get host(): string {
    const { hostname, port } = this;
    return port ? `${hostname}:${port}` : hostname;
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
    const { protocol, host } = this;
    if (protocol || host) {
      return `${protocol}//${host}`;
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

  get searchParams(): ISearchParams {
    return parseQueryString(this.search);
  }

  set searchParams(params: ISearchParams) {
    this.search = formatQueryString(params);
  }

  public addSearchParam(key: string, value: string): URL {
    this.search += `${this.search ? '&' : '?'}${key}=${value}`;
    return this;
  }

  public sortSearch(): string {
    return (this.search = formatQueryString(this.searchParams));
  }

  get href(): string {
    return `${this.origin}${this.pathname}${this.search}${this.hash}`;
  }

  set href(href: string) {
    let rest = href;

    let hash: string;
    [rest, hash] = splitHash(rest);
    this.hash = hash;

    let search: string;
    [rest, search] = splitQuery(rest);
    this.search = search;

    let protocol: string;
    [protocol, rest] = splitProtocol(rest);
    this.protocol = protocol;

    if (startingDoubleSlash.test(rest)) {
      rest = rest.substring(2);

      const [host, pathname] = splitPath(rest);
      this.host = host;
      this.pathname = pathname;
    } else {
      this.host = '';
      this.pathname = rest ? (rest.charAt(0) === '/' ? rest : `/${rest}`) : '';
    }
  }

  get normalizedHref(): string {
    return `${this.origin}${this.pathname}${formatQueryString(
      this.searchParams
    )}${this.hash}`;
  }
}
