const $fx = require('../../packages/fx');

const $console = console;

$console.log(
  Object.keys($fx).map(
    (name) => (`../../packages/fx/${name}`),
  ).join('\n'),
);

describe('fx.easing', () => {
  test('fx.easing', () => {

  });
});
