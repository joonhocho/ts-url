export interface ISearchParams {
  [key: string]: string | null;
}

export const parseQueryString = (search: string): ISearchParams => {
  const params: ISearchParams = {};
  if (search.length > 1) {
    const parts = decodeURIComponent(search)
      .substring(1)
      .split('&');
    for (let i = 0, len = parts.length; i < len; i += 1) {
      const part = parts[i];
      if (part) {
        const index = part.indexOf('=');
        if (index === -1) {
          params[part] = null;
        } else {
          params[part.substring(0, index)] = part.substring(index + 1);
        }
      }
    }
  }
  return params;
};

export const formatQueryString = (params: ISearchParams): string => {
  const keys = Object.keys(params);
  return keys.length
    ? `?${keys
        .map((k) => {
          const v = params[k];
          return v == null
            ? encodeURIComponent(k)
            : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
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