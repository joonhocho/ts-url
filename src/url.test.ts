// tslint:disable typedef
import { URL } from './index';

const defaultUrlProps = {
  _hash: '',
  _hostname: '',
  _pathname: '',
  _protocol: '',
  _search: '',
  _searchParams: {},
  port: '',
  username: '',
  password: '',
  leadingSlashes: '//',
};

describe('URL', () => {
  test('', () => {
    const url = new URL('');
    expect(url).toEqual({
      ...defaultUrlProps,
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
    expect(url).toEqual({
      ...defaultUrlProps,
      _hash: '#f',
      _hostname: 'a.com',
      _pathname: '/b/c',
      _search: '?d=e',
      _searchParams: { d: 'e' },
    });
    expect(url.href).toBe('//a.com/b/c?d=e#f');
  });

  test('//a.com/b/c?d=e#f', () => {
    const url = new URL('//a.com/b/c?d=e#f');
    expect(url).toEqual({
      ...defaultUrlProps,
      _hash: '#f',
      _hostname: 'a.com',
      _pathname: '/b/c',
      _search: '?d=e',
      _searchParams: { d: 'e' },
    });
    expect(url.href).toBe('//a.com/b/c?d=e#f');
  });

  test('/path', () => {
    const url = new URL('/path');
    expect(url).toEqual({
      ...defaultUrlProps,
      _pathname: '/path',
    });
    expect(url.searchParams).toEqual({});
    expect(url.href).toBe('/path');
    expect(url.clone().href).toBe(url.href);
  });

  test('//path', () => {
    const url = new URL('//path');
    expect(url).toEqual({
      ...defaultUrlProps,
      _hostname: 'path',
    });
    expect(url.searchParams).toEqual({});
    expect(url.href).toBe('//path');
  });

  test('//a.b/c/d', () => {
    const url = new URL('//a.b/c/d');
    expect(url).toEqual({
      ...defaultUrlProps,
      _hostname: 'a.b',
      _pathname: '/c/d',
    });
    expect(url.searchParams).toEqual({});
    expect(url.href).toBe('//a.b/c/d');
  });

  test('http://localhost:3000', () => {
    const url = new URL('http://localhost:3000');
    expect(url).toEqual({
      ...defaultUrlProps,
      _hostname: 'localhost',
      _protocol: 'http:',
      port: '3000',
    });
    expect(url.searchParams).toEqual({});
    expect(url.href).toBe('http://localhost:3000');
  });

  test('https://a.b.google.com:8080/settings/account?d&c=&b=2&a=1=2#thisis-hash-tag/?thue', () => {
    const url = new URL(
      'https://a.b.google.com:8080/settings/account?d&c=&b=2&a=1=2#thisis-hash-tag/?thue'
    );
    expect(url).toEqual({
      ...defaultUrlProps,
      _hash: '#thisis-hash-tag/?thue',
      _hostname: 'a.b.google.com',
      _pathname: '/settings/account',
      _protocol: 'https:',
      _search: '?d&c=&b=2&a=1%3D2',
      _searchParams: { a: '1=2', b: '2', c: '', d: null },
      port: '8080',
    });
    expect(url.searchParams).toEqual({ a: '1=2', b: '2', c: '', d: null });
    expect(url.href).toBe(
      'https://a.b.google.com:8080/settings/account?d&c=&b=2&a=1%3D2#thisis-hash-tag/?thue'
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
      'https://a.b.google.com:8080/settings/account?d&c=&b=2&a=1%3D2#thisis-hash-tag/?thue'
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
      ...defaultUrlProps,
      _hash: '#thisis-hash-tag/?thue',
      _hostname: 'youtube.com',
      _pathname: '/a/b/c/',
      _protocol: 'http:',
      _search: '?e=&d=1&f',
      _searchParams: { d: '1', e: '', f: null },
      port: '',
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
    expect(url).toEqual({
      ...defaultUrlProps,
      _pathname: '/a/b',
    });
    expect(url.href).toBe('/a/b');
    url.pathname = '';
    expect(url.pathname).toBe('');
    expect(url.pathnameParts).toEqual([]);
    url.pathname = '/';
    expect(url.pathname).toBe('/');
    expect(url.pathnameParts).toEqual(['']);
    url.pathname = 'a/b';
    expect(url.pathname).toBe('a/b');
    expect(url.pathnameParts).toEqual(['a', 'b']);
    url.pathname = 'a/b/';
    expect(url.pathname).toBe('a/b/');
    expect(url.pathnameParts).toEqual(['a', 'b', '']);
  });

  test('search', () => {
    const url = new URL('?a=1&b=&c');
    expect(url).toEqual({
      ...defaultUrlProps,
      _search: '?a=1&b=&c',
      _searchParams: { a: '1', b: '', c: null },
    });
    expect(url.searchParams).toEqual({ a: '1', b: '', c: null });
    expect(url.href).toBe('?a=1&b=&c');
    url.search = '';
    expect(url.search).toBe('');
    url.search = '?';
    expect(url.search).toBe('');
    url.search = 'a=b';
    expect(url.search).toBe('?a=b');

    expect(url.setSearchParam('a', 'c').search).toBe('?a=c');
    expect(url.setSearchParam('a', null).search).toBe('?a');
    expect(url.removeSearchParam('a').search).toBe('');
    expect(url.setSearchParam('a', '1').search).toBe('?a=1');
    expect(url.setSearchParam('b', '2').search).toBe('?a=1&b=2');
    expect(url.setSearchParams({ a: null, c: '3' }).search).toBe('?a&b=2&c=3');
    expect(url.setSearchParams({}).search).toBe('?a&b=2&c=3');
    expect(url.setSearchParams({ a: undefined, c: undefined }).search).toBe(
      '?b=2'
    );
    expect(url.setSearchParams({ b: undefined, c: undefined }).search).toBe('');
  });

  test('search encode', () => {
    const url = new URL('?<a>=<b>&<c>=&<d>&=&');

    expect(url).toEqual({
      ...defaultUrlProps,
      _search: '?%3Ca%3E=%3Cb%3E&%3Cc%3E=&%3Cd%3E&=',
      _searchParams: { '': '', '<a>': '<b>', '<c>': '', '<d>': null },
    });

    expect(url.href).toBe('?%3Ca%3E=%3Cb%3E&%3Cc%3E=&%3Cd%3E&=');

    url.search = '';
    expect(url.search).toBe('');

    url.search = '?<a>=<b>&<c>=&<d>&=&';
    expect(url.search).toBe('?%3Ca%3E=%3Cb%3E&%3Cc%3E=&%3Cd%3E&=');

    url.search = '';
    expect(url.setSearchParam('<a>', '<b>').search).toBe('?%3Ca%3E=%3Cb%3E');

    expect(url.setSearchParam('<a>', null).search).toBe('?%3Ca%3E');

    expect(url.removeSearchParam('<a>').search).toBe('');
  });

  test('hash', () => {
    const url = new URL('#tag');
    expect(url).toEqual({
      ...defaultUrlProps,
      _hash: '#tag',
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

  test('encoded search & hash', () => {
    const urlParam = 'https://bundlephobia.com/result?p=googleapis@41.0.0#a';
    const encodedUrl = encodeURIComponent(urlParam);

    const url = new URL(
      `https://google.com/search?<a>=<b>&url=${encodedUrl}#${encodedUrl}`
    );

    expect(url.searchParams).toEqual({
      '<a>': '<b>',
      url: urlParam,
    });

    expect(url.hash).toBe(`#${encodedUrl}`);

    expect(url.href).toBe(
      `https://google.com/search?%3Ca%3E=%3Cb%3E&url=${encodedUrl}#${encodedUrl}`
    );
  });

  test('test url as search param', () => {
    const url = new URL(
      `https://images.unsplash.com/photo-1573489999553-4f904df66f7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&url=${encodeURIComponent(
        'https://images.unsplash.com/photo-1573489999553-4f904df66f7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
      )}&auto=format&fit=crop&w=800&q=60`
    );
    expect(url).toEqual({
      ...defaultUrlProps,
      _hostname: 'images.unsplash.com',
      _pathname: '/photo-1573489999553-4f904df66f7e',
      _protocol: 'https:',
      _search:
        '?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1573489999553-4f904df66f7e%3Fixlib%3Drb-1.2.1%26ixid%3DeyJhcHBfaWQiOjEyMDd9%26auto%3Dformat%26fit%3Dcrop%26w%3D800%26q%3D60&auto=format&fit=crop&w=800&q=60',
      _searchParams: {
        auto: 'format',
        fit: 'crop',
        ixid: 'eyJhcHBfaWQiOjEyMDd9',
        ixlib: 'rb-1.2.1',
        q: '60',
        url:
          'https://images.unsplash.com/photo-1573489999553-4f904df66f7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        w: '800',
      },
    });
  });

  test('mailto', () => {
    const url = new URL('mailto: test+1234@gmail.com');
    expect(url).toEqual({
      ...defaultUrlProps,
      _protocol: 'mailto:',
      leadingSlashes: '',
      username: ' test+1234',
      _hostname: 'gmail.com',
    });
    expect(url.href).toEqual('mailto: test+1234@gmail.com');
  });

  test('tel', () => {
    const raw = 'tel:+31123456789';
    const url = new URL(raw);
    expect(url).toEqual({
      ...defaultUrlProps,
      _protocol: 'tel:',
      leadingSlashes: '',
      _hostname: '+31123456789',
    });
    expect(url.href).toEqual(raw);
  });

  test('path only', () => {
    expect(new URL('user/id')).toEqual({
      ...defaultUrlProps,
      _hostname: 'user',
      _pathname: '/id',
    });
    expect(new URL('user/id').pathnameParts).toEqual(['id']);

    expect(new URL('user/id/')).toEqual({
      ...defaultUrlProps,
      _hostname: 'user',
      _pathname: '/id/',
    });
    expect(new URL('user/id/').pathnameParts).toEqual(['id', '']);

    expect(new URL('/user/id')).toEqual({
      ...defaultUrlProps,
      _pathname: '/user/id',
    });
    expect(new URL('/user/id').pathnameParts).toEqual(['user', 'id']);

    expect(new URL('/user/id/')).toEqual({
      ...defaultUrlProps,
      _pathname: '/user/id/',
    });
    expect(new URL('/user/id/').pathnameParts).toEqual(['user', 'id', '']);
  });
});

test('path with whitespace', () => {
  const url = new URL('');
  url.pathname = '  ';
  expect(url).toEqual({
    ...defaultUrlProps,
    _pathname: '%20%20',
  });
  expect(url.pathnameParts).toEqual(['%20%20']);
});

test('android.resource://com.example.project/', () => {
  const url = new URL('android.resource://com.example.project/');
  expect(url).toEqual({
    ...defaultUrlProps,
    _protocol: 'android.resource:',
    _hostname: 'com.example.project',
    _pathname: '/',
  });
  expect(url.pathnameParts).toEqual(['']);
});

test('normalizedHref, relativeHref', () => {
  const url = new URL('HTTP://GooGle.Com/');
  expect(url).toEqual({
    ...defaultUrlProps,
    _hostname: 'google.com',
    _pathname: '/',
    _protocol: 'http:',
  });
  expect(url.href).toEqual('http://google.com/');
  expect(url.normalizedHref).toEqual('http://google.com/');
  expect(url.relativeHref).toEqual('/');
  expect(url.normalizedRelativeHref).toEqual('/');
  expect(url.pathnameParts).toEqual(['']);
});

test('normalizedHref, relativeHref', () => {
  const url = new URL(
    'HtTPs://UseR:PasS@GooGle.Com:1234/HelloWorld/YouTube/?B=2&a=1#HaSh'
  );
  expect(url).toEqual({
    ...defaultUrlProps,
    _hash: '#HaSh',
    _hostname: 'google.com',
    _pathname: '/HelloWorld/YouTube/',
    _protocol: 'https:',
    _search: '?B=2&a=1',
    _searchParams: { B: '2', a: '1' },
    password: 'PasS',
    port: '1234',
    username: 'UseR',
  });
  expect(url.href).toEqual(
    'https://UseR:PasS@google.com:1234/HelloWorld/YouTube/?B=2&a=1#HaSh'
  );
  expect(url.normalizedHref).toEqual(
    'https://UseR:PasS@google.com:1234/HelloWorld/YouTube/?a=1&B=2#HaSh'
  );
  expect(url.relativeHref).toEqual('/HelloWorld/YouTube/?B=2&a=1#HaSh');
  expect(url.normalizedRelativeHref).toEqual(
    '/HelloWorld/YouTube/?a=1&B=2#HaSh'
  );
  expect(url.pathnameParts).toEqual(['HelloWorld', 'YouTube', '']);
});

test('pathnameParts', () => {
  const url = new URL('https://google.com');

  url.pathname = '';
  expect(url.pathname).toEqual('');
  expect(url.pathnameParts).toEqual([]);

  url.pathname = '/';
  expect(url.pathname).toEqual('/');
  expect(url.pathnameParts).toEqual(['']);

  url.pathname = '/a';
  expect(url.pathname).toEqual('/a');
  expect(url.pathnameParts).toEqual(['a']);

  url.pathname = '/a/';
  expect(url.pathname).toEqual('/a/');
  expect(url.pathnameParts).toEqual(['a', '']);

  url.pathname = '/a/b';
  expect(url.pathname).toEqual('/a/b');
  expect(url.pathnameParts).toEqual(['a', 'b']);

  url.pathnameParts = [];
  expect(url.pathname).toEqual('');
  expect(url.pathnameParts).toEqual([]);

  url.pathnameParts = [''];
  expect(url.pathname).toEqual('/');
  expect(url.pathnameParts).toEqual(['']);

  url.pathnameParts = ['a'];
  expect(url.pathname).toEqual('/a');
  expect(url.pathnameParts).toEqual(['a']);

  url.pathnameParts = ['a', ''];
  expect(url.pathname).toEqual('/a/');
  expect(url.pathnameParts).toEqual(['a', '']);

  url.pathnameParts = ['a', 'b'];
  expect(url.pathname).toEqual('/a/b');
  expect(url.pathnameParts).toEqual(['a', 'b']);
});
