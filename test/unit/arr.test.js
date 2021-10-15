const $arr = require('../../packages/arr');

const $console = console;

$console.log(
  Object.keys($arr).map(
    (name) => (`../../packages/arr/${name}`),
  ).join('\n'),
);

describe('arr.contains', () => {
  test('contains([1, 2], 1) => true', () => {
    expect($arr.contains([1, 2], 1)).toBe(true);
  });
});

describe('arr.erase', () => {
  test('erase([1, 2], 1) => [2]', () => {
    const arr = [1, 2];
    $arr.erase(arr, 1);
    expect(arr.join()).toBe('2');
  });
});

describe('arr.find', () => {
  test('find([1, 2, 3, 3, 4, 5], val => (val === 3)) => [2,3]', () => {
    const arr = [1, 2, 3, 3, 4, 5];
    const pos = $arr.find(arr, (val) => (val === 3));
    expect(pos.join()).toBe('2,3');
  });
});

describe('arr.flatten', () => {
  test('flatten([[1, 2], [3, [4]]]) => [1,2,3,4]', () => {
    const arr = [[1, 2], [3, [4]]];
    const farr = $arr.flatten(arr);
    expect(farr.join()).toBe('1,2,3,4');
  });
});

describe('arr.include', () => {
  test('include([[1, 2], 1) => [1,2]', () => {
    const arr = [1, 2];
    $arr.include(arr, 1);
    expect(arr.join()).toBe('1,2');
    $arr.include(arr, 3);
    expect(arr.join()).toBe('1,2,3');
  });
});
