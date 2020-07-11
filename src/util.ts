const trimLeftRegex = /^\s+/;
const trimRightRegex = /\s+$/;

export const trim =
  typeof ''.trim === 'function'
    ? (s: string): string => s.trim()
    : (s: string): string =>
        s.replace(trimLeftRegex, '').replace(trimRightRegex, '');

export const prefix = (s: string, pre: string): string => {
  const { length } = pre;
  if (s.substring(0, length) === pre) {
    return s;
  }
  return `${pre}${s}`;
};

export const deprefix = (s: string, pre: string): string => {
  const { length } = pre;
  if (s.substring(0, length) === pre) {
    return s.substring(length);
  }
  return s;
};

export const prefixChar = (s: string, pre: string): string =>
  s[0] === pre ? s : `${pre}${s}`;

export const deprefixChar = (s: string, pre: string): string =>
  s[0] === pre ? s.substring(1) : s;

export const splitUserInfo = (s: string): [string, string] => {
  // auth@host
  const i = s.indexOf('@');
  return i === -1 ? ['', s] : [s.substring(0, i), s.substring(i + 1)];
};

export const splitPassword = (s: string): [string, string] => {
  // username
  // :password
  // username:password
  const i = s.indexOf(':');
  return i === -1 ? [s, ''] : [s.substring(0, i), s.substring(i + 1)];
};

export const splitHash = (url: string): [string, string] => {
  const i = url.indexOf('#');
  return i === -1 ? [url, ''] : [url.substring(0, i), url.substring(i)];
};

export const splitQuery = (url: string): [string, string] => {
  const i = url.indexOf('?');
  return i === -1 ? [url, ''] : [url.substring(0, i), url.substring(i)];
};

export const splitPathname = (url: string): [string, string] => {
  const i = url.indexOf('/');
  return i === -1 ? [url, ''] : [url.substring(0, i), url.substring(i)];
};

const protocolRegex = /^[\w.]*:/;

export const splitProtocol = (url: string): [string, string] => {
  const match = url.match(protocolRegex);
  if (match) {
    const protocol = match[0];
    return [protocol, url.substring(protocol.length)];
  }
  return ['', url];
};

const questionMarkRegex = /\?/g;
const hashRegex = /#/g;

export const encodePathname = (pathname: string): string =>
  encodeURI(pathname)
    .replace(questionMarkRegex, '%3F')
    .replace(hashRegex, '%23');

const malformedRegex = /%(?![0-9][0-9a-fA-F]+)/g;

export const decodeURISafe = (s: string): string =>
  s && decodeURI(s.replace(malformedRegex, '%25'));

export const decodeURIComponentSafe = (s: string): string =>
  s && decodeURIComponent(s.replace(malformedRegex, '%25'));
