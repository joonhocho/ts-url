"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryString = (search) => {
    const params = {};
    (search[0] === '?' ? search.substring(1) : search)
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
        .filter((x) => x)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .forEach(([k, v]) => {
        params[k] = v;
    });
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
class URL {
    constructor(url) {
        this.protocol = '';
        this.hostname = '';
        this.port = '';
        this.pathname = '';
        this.search = '';
        this.hash = '';
        this.href = url;
    }
    get host() {
        const { hostname, port } = this;
        return port ? `${hostname}:${port}` : hostname;
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
        const { protocol, host } = this;
        if (protocol || host) {
            return `${protocol}//${host}`;
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
    get searchParams() {
        return exports.parseQueryString(this.search);
    }
    set searchParams(params) {
        this.search = exports.formatQueryString(params);
    }
    addSearchParam(key, value) {
        this.search += `${this.search ? '&' : '?'}${key}=${value}`;
        return this;
    }
    sortSearch() {
        return (this.search = exports.formatQueryString(this.searchParams));
    }
    get href() {
        return `${this.origin}${this.pathname}${this.search}${this.hash}`;
    }
    set href(href) {
        let rest = href;
        let hash;
        [rest, hash] = exports.splitHash(rest);
        this.hash = hash;
        let search;
        [rest, search] = exports.splitQuery(rest);
        this.search = search;
        let protocol;
        [protocol, rest] = exports.splitProtocol(rest);
        this.protocol = protocol;
        if (startingDoubleSlash.test(rest)) {
            rest = rest.substring(2);
            const [host, pathname] = exports.splitPath(rest);
            this.host = host;
            this.pathname = pathname;
        }
        else {
            this.host = '';
            this.pathname = rest ? (rest.charAt(0) === '/' ? rest : `/${rest}`) : '';
        }
    }
    get normalizedHref() {
        return `${this.origin}${this.pathname}${exports.formatQueryString(this.searchParams)}${this.hash}`;
    }
}
exports.URL = URL;
//# sourceMappingURL=index.js.map