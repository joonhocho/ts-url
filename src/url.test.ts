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
    expect(url.clone().href).toBe(url.href);
  });

  test('build', () => {
    const url = new URL('');
    url.origin = 'a.com';
    url.pathname = '/b/c';
    url.search = '?d=e';
    url.hash = '#f';
    expect(url.href).toBe('//a.com/b/c?d=e#f');
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
    expect(url.clone().href).toBe(url.href);
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

  test('//a.b/c/d', () => {
    const url = new URL('//a.b/c/d');
    expect(url).toMatchObject({
      protocol: '',
      hostname: 'a.b',
      port: '',
      pathname: '/c/d',
      search: '',
      hash: '',
    });
    expect(url.searchParams).toEqual({});
    expect(url.href).toBe('//a.b/c/d');
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
      'https://a.b.google.com:8080/settings/account?a=1%3D2&b=2&c=&d#thisis-hash-tag/?thue'
    );
    expect(url.clone().href).toBe(url.href);
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
    url.setSearchParam('g', 'gg');
    expect(url.search).toBe('?d=1&e=&f&g=gg');
    expect(url.searchParams).toEqual({ e: '', d: '1', f: null, g: 'gg' });
    expect(url.clone().href).toBe(url.href);
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
    url.pathname = '';
    expect(url.pathname).toBe('');
    expect(url.pathnameParts).toEqual([]);
    url.pathname = '/';
    expect(url.pathname).toBe('/');
    expect(url.pathnameParts).toEqual(['']);
    url.pathname = 'a/b';
    expect(url.pathname).toBe('/a/b');
    expect(url.pathnameParts).toEqual(['a', 'b']);
    url.pathname = 'a/b/';
    expect(url.pathname).toBe('/a/b/');
    expect(url.pathnameParts).toEqual(['a', 'b', '']);
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
    url.search = '';
    expect(url.search).toBe('');
    url.search = '?';
    expect(url.search).toBe('?');
    url.search = 'a=b';
    expect(url.search).toBe('?a=b');

    expect(url.setSearchParam('a', 'c').search).toBe('?a=c');
    expect(url.setSearchParam('a', null).search).toBe('?a');
    expect(url.removeSearchParam('a').search).toBe('');
    expect(url.setSearchParam('a', '1').search).toBe('?a=1');
    expect(url.setSearchParam('b', '2').search).toBe('?a=1&b=2');
    expect(url.setSearchParams({ a: null, c: '3' }).search).toBe('?a&b=2&c=3');
    expect(url.setSearchParams({}).search).toBe('?a&b=2&c=3');
  });

  test('search encode', () => {
    const url = new URL('?<a>=<b>&<c>=&<d>&=&');

    expect(url).toMatchObject({
      protocol: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '?%3Ca%3E=%3Cb%3E&%3Cc%3E=&%3Cd%3E&=&',
      hash: '',
    });

    expect(url.searchParams).toEqual({
      '': '',
      '<a>': '<b>',
      '<c>': '',
      '<d>': null,
    });

    expect(url.href).toBe('?%3Ca%3E=%3Cb%3E&%3Cc%3E=&%3Cd%3E&=&');

    url.search = '';
    expect(url.search).toBe('');

    url.search = '?<a>=<b>&<c>=&<d>&=&';
    expect(url.search).toBe('?%3Ca%3E=%3Cb%3E&%3Cc%3E=&%3Cd%3E&=&');

    url.search = '';
    expect(url.setSearchParam('<a>', '<b>').search).toBe('?%3Ca%3E=%3Cb%3E');

    expect(url.setSearchParam('<a>', null).search).toBe('?%3Ca%3E');

    expect(url.removeSearchParam('<a>').search).toBe('');
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
    url.hash = '';
    expect(url.hash).toBe('');
    url.hash = '';
    expect(url.hash).toBe('');
    url.hash = '#';
    expect(url.hash).toBe('#');
    url.hash = 'hh';
    expect(url.hash).toBe('#hh');
  });

  test('isSubpathOf', () => {
    const testSubpath = (
      sub: string,
      parent: string,
      expected: boolean
    ): void => expect(new URL(sub).isSubpathOf(new URL(parent))).toBe(expected);

    testSubpath('', '', true);
    testSubpath('/', '', true);
    testSubpath('http://', '', false);
    testSubpath('http://', 'http://', true);
    testSubpath('http://local:1234', 'http://local:1234', true);
    testSubpath('http://local:1234', 'http://local:123', false);
    testSubpath('http://localhost:1234', 'http://local:1234', false);
    testSubpath('http://local:1234', 'https://local:1234', false);
    testSubpath('https://local:1234', 'http://local:1234', false);
    testSubpath('https://local:1234/', 'https://local:1234', true);
    testSubpath('https://local:1234', 'https://local:1234/', false);
    testSubpath('https://local:1234/', 'https://local:1234/', true);
    testSubpath('https://local:1234/a', 'https://local:1234/', false);
    testSubpath('https://local:1234/a', 'https://local:1234/a', true);
    testSubpath('https://local:1234/aa', 'https://local:1234/a', false);
    testSubpath('https://local:1234/a/', 'https://local:1234/a', true);
    testSubpath('https://local:1234/a', 'https://local:1234/a/', false);
    testSubpath('https://local:1234/a', 'https://local:1234/a/b', false);
    testSubpath('https://local:1234/a/b', 'https://local:1234/a', true);
    testSubpath('https://local:1234/a/b/', 'https://local:1234/a', true);
    testSubpath('https://local:1234/a/b?a', 'https://local:1234/a', true);
    testSubpath('https://local:1234/a/b?a', 'https://local:1234/a?a', false);
    testSubpath('https://local:1234/a/b?a', 'https://local:1234/a#a', false);
    testSubpath(
      'https://local:1234/a/b?a=1&b#h',
      'https://local:1234/a/b',
      true
    );
    testSubpath(
      'https://local:1234/a/b?a=1#h',
      'https://local:1234/a/b?a=1#h',
      true
    );
    testSubpath(
      'https://local:1234/a/b?a=1#h1',
      'https://local:1234/a/b?a=1#h',
      false
    );
    testSubpath(
      'https://local:1234/a/b?a=1#h1',
      'https://local:1234/a/b?a=2#h',
      false
    );
    testSubpath(
      'https://local:1234/a/b#h1',
      'https://local:1234/a/b?a=2#h',
      false
    );
    testSubpath(
      'https://local:1234/a/b?b=2&a=1&c=3#h',
      'https://local:1234/a/b?a=1#h',
      true
    );
  });
});
