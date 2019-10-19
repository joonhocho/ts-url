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

const protocolRegex = /^(\w*:)\/\//;

export const splitProtocol = (url: string): [string, string] => {
  const match = url.match(protocolRegex);
  if (match) {
    const protocol = match[1];
    return [protocol, url.substring(protocol.length)];
  }
  return ['', url];
};
