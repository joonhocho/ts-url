// tslint:disable member-ordering
import {
  formatQueryString,
  ISearchParams,
  parseQueryString,
  sortKeys,
} from './search';
import {
  deprefixChar,
  encodePathname,
  prefixChar,
  splitHash,
  splitPassword,
  splitPathname,
  splitProtocol,
  splitQuery,
  splitUserInfo,
  trim,
} from './util';

const portRegex = /:(\d+)$/;

const edgeSlash = /^\/+|\/+$/g;

export const protocolSlashes: { [key: string]: string } = {
  'ftp:': '//',
  'http:': '//',
  'https:': '//',
  'mailto:': '',
  'tel:': '',
  '': '//',
};

export class URL {
  private _protocol = '';
  public leadingSlashes = protocolSlashes[''];
  public username = '';
  public password = '';
  private _hostname = '';
  public port = '';
  private _pathname = '';
  private _search = '';
  private _searchParams: ISearchParams = {};
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
    const slashes = protocolSlashes[this._protocol];
    this.leadingSlashes =
      typeof slashes === 'string' ? slashes : protocolSlashes[''];
  }

  get userinfo(): string {
    const { username, password } = this;
    return password ? `${username}:${password}` : username;
  }

  set userinfo(userinfo: string) {
    const [username, password] = splitPassword(userinfo);
    this.username = username;
    this.password = password;
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
      return `${_protocol}${this.leadingSlashes}${host}`;
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

  get originWithUserinfo(): string {
    const { _protocol, userinfo, host } = this;
    if (_protocol || userinfo || host) {
      return `${_protocol}${this.leadingSlashes}${
        userinfo ? `${userinfo}@` : ''
      }${host}`;
    }
    return '';
  }

  get pathname(): string {
    return this._pathname;
  }

  set pathname(pathname: string) {
    if (!pathname) {
      this._pathname = '';
    } else if (pathname === '/') {
      this._pathname = '/';
    } else {
      const hasPrefix = pathname[0] === '/';
      const encoded = encodePathname(
        decodeURIComponent(deprefixChar(pathname, '/'))
      );
      this._pathname =
        hasPrefix || this._hostname || this.port
          ? prefixChar(encoded, '/')
          : encoded;
    }
  }

  get pathnameParts(): string[] {
    const { _pathname } = this;
    return _pathname ? deprefixChar(_pathname, '/').split('/') : [];
  }

  get search(): string {
    return this._search;
  }

  set search(search: string) {
    if (!search) {
      this._search = '';
      this._searchParams = {};
    } else if (search === '?') {
      this._search = '?';
      this._searchParams = {};
    } else {
      const searchParams = parseQueryString(prefixChar(search, '?'));
      this._search = formatQueryString(searchParams);
      this._searchParams = searchParams;
    }
  }

  get searchParams(): ISearchParams {
    return this._searchParams;
  }

  set searchParams(params: ISearchParams) {
    this._search = formatQueryString(params);
    this._searchParams = params;
  }

  get hash(): string {
    return this._hash;
  }

  set hash(hash: string) {
    if (!hash) {
      this._hash = '';
    } else if (hash === '#') {
      this._hash = '#';
    } else {
      this._hash = prefixChar(
        encodeURIComponent(decodeURIComponent(deprefixChar(hash, '#'))),
        '#'
      );
    }
  }

  get href(): string {
    return `${this.originWithUserinfo}${this._pathname}${this._search}${this._hash}`;
  }

  set href(href: string) {
    let rest = trim(href);

    let hash: string;
    [rest, hash] = splitHash(rest);
    this._hash = hash;

    let search: string;
    [rest, search] = splitQuery(rest);
    this.search = search;

    let protocol: string;
    [protocol, rest] = splitProtocol(rest);
    this.protocol = protocol;

    let pathname: string;
    if (rest.substring(0, 2) === '//') {
      rest = rest.substring(2);
      [rest, pathname] = splitPathname(rest);
    } else {
      [rest, pathname] = splitPathname(rest);
    }
    this.pathname = pathname;

    const [userinfo, host] = splitUserInfo(rest);
    this.host = host;
    this.userinfo = userinfo;
  }

  get normalizedHref(): string {
    return `${this.originWithUserinfo}${this._pathname}${formatQueryString(
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
    const searchParams = sortKeys(this.searchParams);
    this._search = formatQueryString(searchParams);
    this._searchParams = searchParams;
    return this._search;
  }

  public clone(): URL {
    const clone = new URL('');
    clone._protocol = this._protocol;
    clone.leadingSlashes = this.leadingSlashes;
    clone.username = this.username;
    clone.password = this.password;
    clone._hostname = this._hostname;
    clone.port = this.port;
    clone._pathname = this._pathname;
    clone._search = this._search;
    clone._searchParams = this._searchParams;
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
