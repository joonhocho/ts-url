import { URL } from 'url';

import {
  deprefix,
  deprefixChar,
  encodePathname,
  prefix,
  prefixChar,
  splitHash,
  splitPassword,
  splitPathname,
  splitProtocol,
  splitQuery,
  splitUserInfo,
  trim,
} from './util';

test('trim', () => {
  expect(trim('')).toBe('');
  expect(trim('   ')).toBe('');
  expect(trim(' a  ')).toBe('a');
});

test('encodePathname', () => {
  expect(encodePathname(' ,/:@&=+$?#')).toBe('%20,/:@&=+$%3F%23');

  expect(encodePathname(' ,/:@&=+$?# ,/:@&=+$?#')).toBe(
    '%20,/:@&=+$%3F%23%20,/:@&=+$%3F%23'
  );

  const url = new URL('https://username:password@google.com/a');
  url.pathname = ' ,/:@&=+$?#';
  expect(url.pathname).toBe('/%20,/:@&=+$%3F%23');
  expect(url.pathname).toBe(`/${encodePathname(' ,/:@&=+$?#')}`);
});

test('encodeURI', () => {
  expect(encodeURI(' ,/:@&=+$?#')).toBe('%20,/:@&=+$?#');
  expect(
    encodeURI(
      'https://username:password@www.google.com:8080/search?q=text&page=2&code=<html/>\'"#results'
    )
  ).toBe(
    "https://username:password@www.google.com:8080/search?q=text&page=2&code=%3Chtml/%3E'%22#results"
  );
});

test('encodeURIComponent', () => {
  expect(encodeURIComponent(' ,/:@&=+$?#')).toBe(
    '%20%2C%2F%3A%40%26%3D%2B%24%3F%23'
  );
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

test('prefixChar', () => {
  expect(prefixChar('a', '/')).toBe('/a');
  expect(prefixChar('/a', '/')).toBe('/a');
  expect(prefixChar('//a', '/')).toBe('//a');

  expect(prefixChar('a', '?')).toBe('?a');
  expect(prefixChar('?a', '?')).toBe('?a');
  expect(prefixChar('??a', '?')).toBe('??a');
});

test('deprefixChar', () => {
  expect(deprefixChar('a', '/')).toBe('a');
  expect(deprefixChar('/a', '/')).toBe('a');
  expect(deprefixChar('//a', '/')).toBe('/a');

  expect(deprefixChar('a', '?')).toBe('a');
  expect(deprefixChar('?a', '?')).toBe('a');
  expect(deprefixChar('?/a', '?')).toBe('/a');
});

test('splitUserInfo', () => {
  expect(splitUserInfo('')).toEqual(['', '']);
  expect(splitUserInfo('a')).toEqual(['', 'a']);
  expect(splitUserInfo('@')).toEqual(['', '']);
  expect(splitUserInfo('a@')).toEqual(['a', '']);
  expect(splitUserInfo('@a')).toEqual(['', 'a']);
  expect(splitUserInfo('a@b')).toEqual(['a', 'b']);
  expect(splitUserInfo('a@b@c')).toEqual(['a', 'b@c']);
});

test('splitPassword', () => {
  expect(splitPassword('')).toEqual(['', '']);
  expect(splitPassword('a')).toEqual(['a', '']);
  expect(splitPassword(':')).toEqual(['', '']);
  expect(splitPassword('a:')).toEqual(['a', '']);
  expect(splitPassword(':a')).toEqual(['', 'a']);
  expect(splitPassword('a:b')).toEqual(['a', 'b']);
  expect(splitPassword('a:b:c')).toEqual(['a', 'b:c']);
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
  expect(splitProtocol(':')).toEqual([':', '']);
  expect(splitProtocol(':/')).toEqual([':', '/']);
  expect(splitProtocol('://')).toEqual([':', '//']);
  expect(splitProtocol('a://')).toEqual(['a:', '//']);
  expect(splitProtocol('a:///')).toEqual(['a:', '///']);
  expect(splitProtocol('://a')).toEqual([':', '//a']);
  expect(splitProtocol('a://b')).toEqual(['a:', '//b']);
  expect(splitProtocol('a://b://c')).toEqual(['a:', '//b://c']);
});
