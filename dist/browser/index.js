"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryString = function (search) {
    var params = {};
    if (search.length > 1) {
        search
            .substring(1)
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
            .filter(function (x) { return x; }).forEach(function (_a) {
            var k = _a[0], v = _a[1];
            params[k] = v;
        });
    }
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
var compareKeys = function (a, b) { return a.localeCompare(b); };
exports.sortKeys = function (params) {
    var copy = {};
    var keys = Object.keys(params).sort(compareKeys);
    for (var i = 0, len = keys.length; i < len; i += 1) {
        var key = keys[i];
        copy[key] = params[key];
    }
    return copy;
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
exports.prefix = function (s, pre) {
    return s ? (s.charAt(0) === pre ? s : "" + pre + s) : '';
};
var URL = (function () {
    function URL(url) {
        this.port = '';
        this._protocol = '';
        this._hostname = '';
        this._pathname = '';
        this._search = '';
        this._hash = '';
        this.href = url;
    }
    Object.defineProperty(URL.prototype, "protocol", {
        get: function () {
            return this._protocol;
        },
        set: function (protocol) {
            this._protocol = protocol.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URL.prototype, "hostname", {
        get: function () {
            return this._hostname;
        },
        set: function (hostname) {
            this._hostname = hostname.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URL.prototype, "host", {
        get: function () {
            var _a = this, _hostname = _a._hostname, port = _a.port;
            return port ? _hostname + ":" + port : _hostname;
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
            var _a = this, _protocol = _a._protocol, host = _a.host;
            if (_protocol || host) {
                return _protocol + "//" + host;
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
    Object.defineProperty(URL.prototype, "pathname", {
        get: function () {
            return this._pathname;
        },
        set: function (pathname) {
            this._pathname = exports.prefix(pathname, '/');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URL.prototype, "search", {
        get: function () {
            return this._search;
        },
        set: function (search) {
            this._search = exports.prefix(search, '?');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URL.prototype, "searchParams", {
        get: function () {
            return exports.parseQueryString(this._search);
        },
        set: function (params) {
            this._search = exports.formatQueryString(params);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URL.prototype, "hash", {
        get: function () {
            return this._hash;
        },
        set: function (hash) {
            this._hash = exports.prefix(hash, '#');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URL.prototype, "href", {
        get: function () {
            return "" + this.origin + this._pathname + this._search + this._hash;
        },
        set: function (href) {
            var _a, _b, _c;
            var rest = href;
            var hash;
            _a = exports.splitHash(rest), rest = _a[0], hash = _a[1];
            this._hash = hash;
            var search;
            _b = exports.splitQuery(rest), rest = _b[0], search = _b[1];
            this._search = search;
            var protocol;
            _c = exports.splitProtocol(rest), protocol = _c[0], rest = _c[1];
            this.protocol = protocol;
            if (startingDoubleSlash.test(rest)) {
                rest = rest.substring(2);
                var _d = exports.splitPath(rest), host = _d[0], pathname = _d[1];
                this.host = host;
                this._pathname = pathname;
            }
            else {
                this.host = '';
                this.pathname = rest;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URL.prototype, "normalizedHref", {
        get: function () {
            return "" + this.origin + this._pathname + exports.formatQueryString(exports.sortKeys(this.searchParams)) + this._hash;
        },
        enumerable: true,
        configurable: true
    });
    URL.prototype.addSearchParam = function (key, value) {
        this._search += "" + (this._search ? '&' : '?') + key + "=" + value;
        return this;
    };
    URL.prototype.sortSearch = function () {
        return (this._search = exports.formatQueryString(exports.sortKeys(this.searchParams)));
    };
    return URL;
}());
exports.URL = URL;
//# sourceMappingURL=index.js.map