import {
  deprefix,
  prefix,
  splitHash,
  splitPathname,
  splitProtocol,
  splitQuery,
} from './util';

test('encodeURI', () => {
  expect(
    encodeURI(
      'https://username:password@www.google.com:8080/search?q=text&page=2&code=<html/>\'"#results'
    )
  ).toBe(
    "https://username:password@www.google.com:8080/search?q=text&page=2&code=%3Chtml/%3E'%22#results"
  );
});

test('encodeURIComponent', () => {
  expect(
    encodeURIComponent(
      'https://username:password@www.google.com:8080/search?q=text&page=2&code=<html/>\'"#results'
    )
  ).toBe(
    "https%3A%2F%2Fusername%3Apassword%40www.google.com%3A8080%2Fsearch%3Fq%3Dtext%26page%3D2%26code%3D%3Chtml%2F%3E'%22%23results"
  );
});

test('deprefix', () => {
  expect(deprefix('', '/')).toBe('');
  expect(deprefix('/', '/')).toBe('');
  expect(deprefix('//', '/')).toBe('/');

  expect(deprefix('', '/?')).toBe('');
  expect(deprefix('/', '/?')).toBe('/');
  expect(deprefix('//', '/?')).toBe('//');
  expect(deprefix('/?', '/?')).toBe('');
  expect(deprefix('/?a', '/?')).toBe('a');
});

test('prefix', () => {
  expect(prefix('', '/')).toBe('/');
  expect(prefix('/', '/')).toBe('/');
  expect(prefix('//', '/')).toBe('//');

  expect(prefix('', '/?')).toBe('/?');
  expect(prefix('/', '/?')).toBe('/?/');
  expect(prefix('//', '/?')).toBe('/?//');
  expect(prefix('/?', '/?')).toBe('/?');
  expect(prefix('/?a', '/?')).toBe('/?a');
});

test('splitHash', () => {
  expect(splitHash('')).toEqual(['', '']);
  expect(splitHash('a')).toEqual(['a', '']);
  expect(splitHash('#')).toEqual(['', '#']);
  expect(splitHash('a#')).toEqual(['a', '#']);
  expect(splitHash('#a')).toEqual(['', '#a']);
  expect(splitHash('a#b')).toEqual(['a', '#b']);
  expect(splitHash('a#b#c')).toEqual(['a', '#b#c']);
});

test('splitPathname', () => {
  expect(splitPathname('')).toEqual(['', '']);
  expect(splitPathname('a')).toEqual(['a', '']);
  expect(splitPathname('/')).toEqual(['', '/']);
  expect(splitPathname('a/')).toEqual(['a', '/']);
  expect(splitPathname('/a')).toEqual(['', '/a']);
  expect(splitPathname('a/b')).toEqual(['a', '/b']);
  expect(splitPathname('a/b/c')).toEqual(['a', '/b/c']);
});

test('splitQuery', () => {
  expect(splitQuery('')).toEqual(['', '']);
  expect(splitQuery('a')).toEqual(['a', '']);
  expect(splitQuery('?')).toEqual(['', '?']);
  expect(splitQuery('a?')).toEqual(['a', '?']);
  expect(splitQuery('?a')).toEqual(['', '?a']);
  expect(splitQuery('a?b')).toEqual(['a', '?b']);
  expect(splitQuery('a?b?c')).toEqual(['a', '?b?c']);
});

test('splitProtocol', () => {
  expect(splitProtocol('')).toEqual(['', '']);
  expect(splitProtocol('a')).toEqual(['', 'a']);
  expect(splitProtocol('/a')).toEqual(['', '/a']);
  expect(splitProtocol('//a')).toEqual(['', '//a']);
  expect(splitProtocol(':')).toEqual(['', ':']);
  expect(splitProtocol(':/')).toEqual(['', ':/']);
  expect(splitProtocol('://')).toEqual([':', '//']);
  expect(splitProtocol('a://')).toEqual(['a:', '//']);
  expect(splitProtocol('a:///')).toEqual(['a:', '///']);
  expect(splitProtocol('://a')).toEqual([':', '//a']);
  expect(splitProtocol('a://b')).toEqual(['a:', '//b']);
  expect(splitProtocol('a://b://c')).toEqual(['a:', '//b://c']);
});
