"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryString = function (search) {
    var params = {};
    (search[0] === '?' ? search.substring(1) : search)
        .split('&')
        .map(function (x) {
        if (x) {
            var i = x.indexOf('=');
            if (i === -1) {
                return [x, null];
            }
            return [x.substring(0, i), x.substring(i + 1)];
        }
        return null;
    })
        .filter(function (x) { return x; })
        .sort(function (a, b) { return a[0].localeCompare(b[0]); })
        .forEach(function (_a) {
        var k = _a[0], v = _a[1];
        params[k] = v;
    });
    return params;
};
exports.formatQueryString = function (params) {
    var keys = Object.keys(params);
    return keys.length
        ? "?" + keys
            .map(function (k) {
            var v = params[k];
            return v == null ? k : k + "=" + v;
        })
            .join('&')
        : '';
};
var protocolRegex = /^(\w+:)\/\//;
var startingDoubleSlash = /^\/\//;
var portRegex = /:(\d+)$/;
var startingSlash = /^\/+/;
var endingSlash = /\/+$/;
exports.splitProtocol = function (url) {
    var match = url.match(protocolRegex);
    if (match) {
        var protocol = match[1];
        return [protocol, url.substring(protocol.length)];
    }
    return ['', url];
};
exports.splitHash = function (url) {
    var i = url.lastIndexOf('#');
    if (i === -1) {
        return [url, ''];
    }
    return [url.substring(0, i), url.substring(i)];
};
exports.splitQuery = function (url) {
    var i = url.lastIndexOf('?');
    if (i === -1) {
        return [url, ''];
    }
    return [url.substring(0, i), url.substring(i)];
};
exports.splitPath = function (url) {
    var i = url.indexOf('/');
    if (i === -1) {
        return [url, ''];
    }
    return [url.substring(0, i), url.substring(i)];
};
var URL = (function () {
    function URL(url) {
        this.protocol = '';
        this.hostname = '';
        this.port = '';
        this.pathname = '';
        this.search = '';
        this.hash = '';
        this.href = url;
    }
    Object.defineProperty(URL.prototype, "host", {
        get: function () {
            var _a = this, hostname = _a.hostname, port = _a.port;
            return port ? hostname + ":" + port : hostname;
        },
        set: function (host) {
            var portMatch = host.match(portRegex);
            if (portMatch) {
                this.hostname = host.substring(0, portMatch.index);
                this.port = portMatch[1];
            }
            else {
                this.hostname = host;
                this.port = '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URL.prototype, "origin", {
        get: function () {
            var _a = this, protocol = _a.protocol, host = _a.host;
            if (protocol || host) {
                return protocol + "//" + host;
            }
            return '';
        },
        set: function (origin) {
            var _a;
            var rest = origin;
            var protocol;
            _a = exports.splitProtocol(rest), protocol = _a[0], rest = _a[1];
            this.protocol = protocol;
            this.host = rest.replace(startingSlash, '').replace(endingSlash, '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URL.prototype, "searchParams", {
        get: function () {
            return exports.parseQueryString(this.search);
        },
        set: function (params) {
            this.search = exports.formatQueryString(params);
        },
        enumerable: true,
        configurable: true
    });
    URL.prototype.addSearchParam = function (key, value) {
        this.search += "" + (this.search ? '&' : '?') + key + "=" + value;
        return this;
    };
    URL.prototype.sortSearch = function () {
        return (this.search = exports.formatQueryString(this.searchParams));
    };
    Object.defineProperty(URL.prototype, "href", {
        get: function () {
            return "" + this.origin + this.pathname + this.search + this.hash;
        },
        set: function (href) {
            var _a, _b, _c;
            var rest = href;
            var hash;
            _a = exports.splitHash(rest), rest = _a[0], hash = _a[1];
            this.hash = hash;
            var search;
            _b = exports.splitQuery(rest), rest = _b[0], search = _b[1];
            this.search = search;
            var protocol;
            _c = exports.splitProtocol(rest), protocol = _c[0], rest = _c[1];
            this.protocol = protocol;
            if (startingDoubleSlash.test(rest)) {
                rest = rest.substring(2);
                var _d = exports.splitPath(rest), host = _d[0], pathname = _d[1];
                this.host = host;
                this.pathname = pathname;
            }
            else {
                this.host = '';
                this.pathname = rest ? (rest.charAt(0) === '/' ? rest : "/" + rest) : '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URL.prototype, "normalizedHref", {
        get: function () {
            return "" + this.origin + this.pathname + exports.formatQueryString(this.searchParams) + this.hash;
        },
        enumerable: true,
        configurable: true
    });
    return URL;
}());
exports.URL = URL;
//# sourceMappingURL=index.js.map