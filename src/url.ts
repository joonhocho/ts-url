import {
  formatQueryString,
  ISearchParams,
  parseQueryString,
  sortKeys,
} from './search';
import {
  deprefix,
  prefix,
  splitHash,
  splitPathname,
  splitProtocol,
  splitQuery,
} from './util';

const portRegex = /:(\d+)$/;

const edgeSlash = /^\/+|\/+$/g;

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

    this.host = rest.replace(edgeSlash, '');
  }

  get pathname(): string {
    return this._pathname;
  }

  set pathname(pathname: string) {
    if (pathname.length === 0) {
      this._pathname = '';
    } else {
      if (pathname === '/') {
        this._pathname = '/';
      } else {
        this._pathname = prefix(
          encodeURI(decodeURIComponent(deprefix(pathname, '/'))),
          '/'
        );
      }
    }
  }

  get pathnameParts(): string[] {
    const { _pathname } = this;
    return _pathname ? _pathname.substring(1).split('/') : [];
  }

  get search(): string {
    return this._search;
  }

  set search(search: string) {
    if (search.length === 0) {
      this._search = '';
    } else {
      if (search === '?') {
        this._search = '?';
      } else {
        this._search = prefix(
          encodeURIComponent(decodeURIComponent(deprefix(search, '?'))),
          '?'
        );
      }
    }
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
    if (hash.length === 0) {
      this._hash = '';
    } else {
      if (hash === '#') {
        this._hash = '#';
      } else {
        this._hash = prefix(
          encodeURIComponent(decodeURIComponent(deprefix(hash, '#'))),
          '#'
        );
      }
    }
  }

  get href(): string {
    return `${this.origin}${this._pathname}${this._search}${this._hash}`;
  }

  set href(href: string) {
    let rest = decodeURI(href);

    let hash: string;
    [rest, hash] = splitHash(rest);
    this._hash = hash;

    let search: string;
    [rest, search] = splitQuery(rest);
    this._search = search;

    let protocol: string;
    [protocol, rest] = splitProtocol(rest);
    this.protocol = protocol;

    if (rest.substring(0, 2) === '//') {
      rest = rest.substring(2);
      const [host, pathname] = splitPathname(rest);
      this.host = host;
      this._pathname = pathname;
    } else {
      this.host = '';
      this._pathname = rest;
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

  public isSubpathOf(parent: URL): boolean {
    if (
      parent._protocol !== this._protocol ||
      parent._hostname !== this._hostname ||
      parent.port !== this.port
    ) {
      return false;
    }

    const samePath = parent._pathname === this._pathname;
    if (samePath) {
      if (parent._hash && parent._hash !== this._hash) {
        return false;
      }

      if (parent._search && parent._search !== this._search) {
        // compare query subset
        const thisQuery = this.searchParams;
        const parentQuery = parent.searchParams;
        const keys = Object.keys(parentQuery);
        for (let i = 0, len = keys.length; i < len; i += 1) {
          const key = keys[i];
          if (parentQuery[key] !== thisQuery[key]) {
            return false;
          }
        }
      }
    } else {
      // different pathname
      if (parent._search || parent._hash) {
        // when different path, parent cannot have search or hash
        return false;
      }
      if (parent._pathname) {
        // compare subpath
        const thisParts = this.pathnameParts;
        const parentParts = parent.pathnameParts;
        for (let i = 0, len = parentParts.length; i < len; i += 1) {
          if (parentParts[i] !== thisParts[i]) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
