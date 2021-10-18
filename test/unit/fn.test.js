const $fn = require('../../packages/fn');

const $console = console;

function defer(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

$console.log(
  Object.keys($fn).map(
    (name) => (`../../packages/fn/${name}`),
  ).join('\n'),
);

describe('fn.delay', () => {
  test('多次触发仅执行 1 次回调', async () => {
    const obj = {
      num: 0,
    };
    const fn = $fn.delay(function () {
      this.num += 1;
    }, 10, obj);
    fn();
    setTimeout(fn, 1);
    await defer(30);
    expect(obj.num).toBe(1);
  });
});

describe('fn.lock', () => {
  test('冷却状态下函数不执行', async () => {
    let num = 0;
    const fn = $fn.lock(() => {
      num += 1;
    }, 10);
    fn();
    setTimeout(fn, 1);
    await defer(30);
    expect(num).toBe(1);
    fn();
    expect(num).toBe(2);
  });
});

describe('fn.once', () => {
  test('确保函数只执行 1 次', async () => {
    let num = 0;
    const fn = $fn.once(() => {
      num += 1;
    });
    fn();
    fn();
    expect(num).toBe(1);
  });
});

describe('fn.queue', () => {
  test('队列函数会按顺序执行', async () => {
    let num = 0;
    const fn = $fn.queue(() => {
      num += 1;
    }, 50);
    fn();
    fn();
    expect(num).toBe(0);
    await defer(60);
    expect(num).toBe(1);
    await defer(60);
    expect(num).toBe(2);
    await defer(60);
  });
});

describe('fn.regular', () => {
  test('函数只会按固定频率被触发', async () => {
    let num = 0;
    const fn = $fn.regular(() => {
      num += 1;
    }, 50);
    const timer = setInterval(() => {
      fn();
    }, 10);
    await defer(120);
    clearInterval(timer);
    expect(num).toBe(2);
    await defer(50);
  });
});

describe('fn.prepare', () => {
  test('函数会在条件就绪后顺序执行', async () => {
    const arr = [];
    const ready = $fn.prepare();
    ready(() => {
      arr.push(1);
    });
    ready(() => {
      arr.push(2);
    });
    expect(arr.length).toBe(0);
    await defer(10);
    ready.ready();
    ready(() => {
      arr.push(3);
    });
    expect(arr.length).toBe(3);
    expect(arr[0]).toBe(1);
    expect(arr[1]).toBe(2);
    expect(arr[2]).toBe(3);
  });
});
