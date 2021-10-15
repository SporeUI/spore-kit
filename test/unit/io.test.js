const $io = require('../../packages/io');

const $console = console;

$console.log(
  Object.keys($io).map(
    (name) => (`../../packages/io/${name}`),
  ).join('\n'),
);

describe('io.ajax', () => {
  test('io.ajax', () => {

  });
});
