import { formatQueryString, parseQueryString } from './search';

test('parseQueryString', () => {
  expect(parseQueryString('?a=b&c=d&a=c&e=&f&&')).toEqual({
    a: 'c',
    c: 'd',
    e: '',
    f: null,
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
    parseQueryString(encodeURIComponent('?<a>=<b>&<c>=<d>&<a>=<c>&<e>=&<f>&&'))
  ).toEqual({
    '<a>': '<c>',
    '<c>': '<d>',
    '<e>': '',
    '<f>': null,
  });
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
