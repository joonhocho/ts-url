// tslint:disable typedef
import { formatQueryString, parseQueryString } from './search';

test('parseQueryString', () => {
  expect(parseQueryString('?a=b&c=d&a=c&e=&f&&')).toEqual({
    a: 'c',
    c: 'd',
    e: '',
    f: null,
  });

  expect(
    parseQueryString(
      `?url=${encodeURIComponent(
        'https://bundlephobia.com/result?p=googleapis@41.0.0'
      )}`
    )
  ).toEqual({
    url: 'https://bundlephobia.com/result?p=googleapis@41.0.0',
  });

  expect(parseQueryString('?<a>=<b>&<c>=<d>&<a>=<c>&<e>=&<f>&&')).toEqual({
    '<a>': '<c>',
    '<c>': '<d>',
    '<e>': '',
    '<f>': null,
  });

  expect(
    parseQueryString(encodeURI('?<a>=<b>&<c>=<d>&<a>=<c>&<e>=&<f>&&'))
  ).toEqual({
    '<a>': '<c>',
    '<c>': '<d>',
    '<e>': '',
    '<f>': null,
  });

  expect(
    parseQueryString(
      `?${encodeURIComponent('<a>=<b>&<c>=<d>&<a>=<c>&<e>=&<f>&&')}`
    )
  ).toEqual({ '<a>=<b>&<c>=<d>&<a>=<c>&<e>=&<f>&&': null });
});

test('formatQueryString', () => {
  expect(
    formatQueryString({
      a: 'c',
      c: 'd',
      e: '',
      f: null,
    })
  ).toEqual('?a=c&c=d&e=&f');

  expect(
    formatQueryString({
      '<a>': '<c>',
      '<c>': '<d>',
      '<e>': '',
      '<f>': null,
      '': null,
    })
  ).toEqual(encodeURI('?<a>=<c>&<c>=<d>&<e>=&<f>&'));

  expect(
    formatQueryString({
      '<a>': '<c>',
      '<c>': '<d>',
      '<e>': '',
      '<f>': null,
      '': '',
    })
  ).toEqual(encodeURI('?<a>=<c>&<c>=<d>&<e>=&<f>&='));
});
