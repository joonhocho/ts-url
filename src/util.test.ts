import {
  deprefix,
  prefix,
  splitHash,
  splitPathname,
  splitProtocol,
  splitQuery,
} from './util';

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
