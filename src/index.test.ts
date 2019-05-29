import { URL } from './index';

describe('URL', () => {
  test('', () => {
    const url = new URL('');
    expect(url).toEqual({
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
    expect(url).toEqual({
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
    expect(url).toEqual({
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
    expect(url).toEqual({
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
    expect(url).toEqual({
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

  test('setOrigin', () => {
    const url = new URL(
      'https://a.b.google.com:8080/settings/account?d&c=&b=2&a=1=2#thisis-hash-tag/?thue'
    );
    url.origin = 'http://youtube.com/';
    url.pathname = '/a/b/c/';
    url.searchParams = { e: '', d: '1', f: null };
    expect(url).toEqual({
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
});
