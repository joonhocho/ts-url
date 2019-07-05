import { URL } from './index';

describe('URL', () => {
  test('', () => {
    const url = new URL('');
    expect(url).toMatchObject({
      protocol: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
    });
    expect(url.searchParams).toEqual({});
    expect(url.href).toBe('');
  });

  test('/path', () => {
    const url = new URL('/path');
    expect(url).toMatchObject({
      protocol: '',
      hostname: '',
      port: '',
      pathname: '/path',
      search: '',
      hash: '',
    });
    expect(url.searchParams).toEqual({});
    expect(url.href).toBe('/path');
  });

  test('//path', () => {
    const url = new URL('//path');
    expect(url).toMatchObject({
      protocol: '',
      hostname: 'path',
      port: '',
      pathname: '',
      search: '',
      hash: '',
    });
    expect(url.searchParams).toEqual({});
    expect(url.href).toBe('//path');
  });

  test('http://localhost:3000', () => {
    const url = new URL('http://localhost:3000');
    expect(url).toMatchObject({
      protocol: 'http:',
      hostname: 'localhost',
      port: '3000',
      pathname: '',
      search: '',
      hash: '',
    });
    expect(url.searchParams).toEqual({});
    expect(url.href).toBe('http://localhost:3000');
  });

  test('https://a.b.google.com:8080/settings/account?d&c=&b=2&a=1=2#thisis-hash-tag/?thue', () => {
    const url = new URL(
      'https://a.b.google.com:8080/settings/account?d&c=&b=2&a=1=2#thisis-hash-tag/?thue'
    );
    expect(url).toMatchObject({
      protocol: 'https:',
      hostname: 'a.b.google.com',
      port: '8080',
      pathname: '/settings/account',
      search: '?d&c=&b=2&a=1=2',
      hash: '#thisis-hash-tag/?thue',
    });
    expect(url.searchParams).toEqual({ a: '1=2', b: '2', c: '', d: null });
    expect(url.href).toBe(
      'https://a.b.google.com:8080/settings/account?d&c=&b=2&a=1=2#thisis-hash-tag/?thue'
    );
    expect(url.normalizedHref).toBe(
      'https://a.b.google.com:8080/settings/account?a=1=2&b=2&c=&d#thisis-hash-tag/?thue'
    );
  });

  test('HTTPS://A.B.GOOGLE.COM:8080/settings/account?d&c=&b=2&a=1=2#thisis-hash-tag/?thue', () => {
    const url = new URL(
      'HTTPS://A.B.GOOGLE.COM:8080/settings/account?d&c=&b=2&a=1=2#thisis-hash-tag/?thue'
    );
    expect(url.href).toBe(
      'https://a.b.google.com:8080/settings/account?d&c=&b=2&a=1=2#thisis-hash-tag/?thue'
    );
  });

  test('setOrigin', () => {
    const url = new URL(
      'https://a.b.google.com:8080/settings/account?d&c=&b=2&a=1=2#thisis-hash-tag/?thue'
    );
    url.origin = 'http://youtube.com/';
    url.pathname = '/a/b/c/';
    url.searchParams = { e: '', d: '1', f: null };
    expect(url).toMatchObject({
      protocol: 'http:',
      hostname: 'youtube.com',
      port: '',
      pathname: '/a/b/c/',
      search: '?e=&d=1&f',
      hash: '#thisis-hash-tag/?thue',
    });
    expect(url.searchParams).toEqual({ e: '', d: '1', f: null });
    expect(url.href).toBe(
      'http://youtube.com/a/b/c/?e=&d=1&f#thisis-hash-tag/?thue'
    );
    expect(url.normalizedHref).toBe(
      'http://youtube.com/a/b/c/?d=1&e=&f#thisis-hash-tag/?thue'
    );
    url.sortSearch();
    expect(url.search).toBe('?d=1&e=&f');
    expect(url.href).toBe(
      'http://youtube.com/a/b/c/?d=1&e=&f#thisis-hash-tag/?thue'
    );
    url.addSearchParam('g', 'gg');
    expect(url.search).toBe('?d=1&e=&f&g=gg');
    expect(url.searchParams).toEqual({ e: '', d: '1', f: null, g: 'gg' });
  });

  test('pathname', () => {
    const url = new URL('/a/b');
    expect(url).toMatchObject({
      protocol: '',
      hostname: '',
      port: '',
      pathname: '/a/b',
      hash: '',
    });
    expect(url.href).toBe('/a/b');
    url.pathname = null as any;
    expect(url.pathname).toBe('');
    url.pathname = 'a/b';
    expect(url.pathname).toBe('/a/b');
  });

  test('search', () => {
    const url = new URL('?a=1&b=&c');
    expect(url).toMatchObject({
      protocol: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '?a=1&b=&c',
      hash: '',
    });
    expect(url.searchParams).toEqual({ a: '1', b: '', c: null });
    expect(url.href).toBe('?a=1&b=&c');
    url.search = null as any;
    expect(url.search).toBe('');
    url.search = 'a=b';
    expect(url.search).toBe('?a=b');
  });

  test('hash', () => {
    const url = new URL('#tag');
    expect(url).toMatchObject({
      protocol: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '#tag',
    });
    expect(url.href).toBe('#tag');
    url.hash = null as any;
    expect(url.hash).toBe('');
    url.hash = 'hh';
    expect(url.hash).toBe('#hh');
  });
});
