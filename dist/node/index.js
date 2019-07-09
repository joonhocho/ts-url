"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryString = (search) => {
    const params = {};
    if (search.length > 1) {
        search
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
            .filter((x) => x).forEach(([k, v]) => {
            params[k] = v;
        });
    }
    return params;
};
exports.formatQueryString = (params) => {
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
const compareKeys = (a, b) => a.localeCompare(b);
exports.sortKeys = (params) => {
    const copy = {};
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
exports.splitProtocol = (url) => {
    const match = url.match(protocolRegex);
    if (match) {
        const protocol = match[1];
        return [protocol, url.substring(protocol.length)];
    }
    return ['', url];
};
exports.splitHash = (url) => {
    const i = url.lastIndexOf('#');
    if (i === -1) {
        return [url, ''];
    }
    return [url.substring(0, i), url.substring(i)];
};
exports.splitQuery = (url) => {
    const i = url.lastIndexOf('?');
    if (i === -1) {
        return [url, ''];
    }
    return [url.substring(0, i), url.substring(i)];
};
exports.splitPath = (url) => {
    const i = url.indexOf('/');
    if (i === -1) {
        return [url, ''];
    }
    return [url.substring(0, i), url.substring(i)];
};
exports.prefix = (s, pre) => s ? (s.charAt(0) === pre ? s : `${pre}${s}`) : '';
class URL {
    constructor(url) {
        this.port = '';
        this._protocol = '';
        this._hostname = '';
        this._pathname = '';
        this._search = '';
        this._hash = '';
        this.href = url;
    }
    get protocol() {
        return this._protocol;
    }
    set protocol(protocol) {
        this._protocol = protocol.toLowerCase();
    }
    get hostname() {
        return this._hostname;
    }
    set hostname(hostname) {
        this._hostname = hostname.toLowerCase();
    }
    get host() {
        const { _hostname, port } = this;
        return port ? `${_hostname}:${port}` : _hostname;
    }
    set host(host) {
        const portMatch = host.match(portRegex);
        if (portMatch) {
            this.hostname = host.substring(0, portMatch.index);
            this.port = portMatch[1];
        }
        else {
            this.hostname = host;
            this.port = '';
        }
    }
    get origin() {
        const { _protocol, host } = this;
        if (_protocol || host) {
            return `${_protocol}//${host}`;
        }
        return '';
    }
    set origin(origin) {
        let rest = origin;
        let protocol;
        [protocol, rest] = exports.splitProtocol(rest);
        this.protocol = protocol;
        this.host = rest.replace(startingSlash, '').replace(endingSlash, '');
    }
    get pathname() {
        return this._pathname;
    }
    set pathname(pathname) {
        this._pathname = exports.prefix(pathname, '/');
    }
    get search() {
        return this._search;
    }
    set search(search) {
        this._search = exports.prefix(search, '?');
    }
    get searchParams() {
        return exports.parseQueryString(this._search);
    }
    set searchParams(params) {
        this._search = exports.formatQueryString(params);
    }
    get hash() {
        return this._hash;
    }
    set hash(hash) {
        this._hash = exports.prefix(hash, '#');
    }
    get href() {
        return `${this.origin}${this._pathname}${this._search}${this._hash}`;
    }
    set href(href) {
        let rest = href;
        let hash;
        [rest, hash] = exports.splitHash(rest);
        this._hash = hash;
        let search;
        [rest, search] = exports.splitQuery(rest);
        this._search = search;
        let protocol;
        [protocol, rest] = exports.splitProtocol(rest);
        this.protocol = protocol;
        if (startingDoubleSlash.test(rest)) {
            rest = rest.substring(2);
            const [host, pathname] = exports.splitPath(rest);
            this.host = host;
            this._pathname = pathname;
        }
        else {
            this.host = '';
            this.pathname = rest;
        }
    }
    get normalizedHref() {
        return `${this.origin}${this._pathname}${exports.formatQueryString(exports.sortKeys(this.searchParams))}${this._hash}`;
    }
    addSearchParam(key, value) {
        this._search += `${this._search ? '&' : '?'}${key}=${value}`;
        return this;
    }
    sortSearch() {
        return (this._search = exports.formatQueryString(exports.sortKeys(this.searchParams)));
    }
}
exports.URL = URL;
//# sourceMappingURL=index.js.map