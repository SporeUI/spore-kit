const $date = require('../../packages/date');

const $console = console;

$console.log(
  Object.keys($date).map(
    (name) => (`../../packages/date/${name}`),
  ).join('\n'),
);

describe('date.format', () => {
  test('format(1540915200000) => "2018-10-31 00:00"', () => {
    const str = $date.format(1540915200000);
    expect(str).toBe('2018-10-31 00:00');
  });
});

describe('date.getLastStart', () => {
  test('必须传递 type 参数', () => {
    let hasError = false;
    try {
      $date.getLastStart(new Date('2018-10-25'));
    } catch (err) {
      hasError = true;
    }
    expect(hasError).toBe(true);
  });
  test('2018-10-25 12:43:12 当天时间戳', () => {
    const time = $date.getLastStart(
      new Date('2018-10-25 12:43:12'),
      'day',
    ).getTime();
    const expectTime = new Date('2018-10-25 00:00').getTime();
    expect(time).toBe(expectTime);
  });
  test('2018-10-25 12:43:12 昨天时间戳', () => {
    const time = $date.getLastStart(
      new Date('2018-10-25 12:43:12'),
      'day',
      1,
    ).getTime();
    const expectTime = new Date('2018-10-24 00:00').getTime();
    expect(time).toBe(expectTime);
  });
  test('2018-10-25 当周周一时间戳', () => {
    const time = $date.getLastStart(
      new Date('2018-10-25'),
      'week',
    ).getTime();
    const expectTime = new Date('2018-10-22 00:00').getTime();
    expect(time).toBe(expectTime);
  });
  test('2018-10-25 当月第1天时间戳', () => {
    const time = $date.getLastStart(
      new Date('2018-10-25'),
      'month',
    ).getTime();
    const expectTime = new Date('2018-10-1').getTime();
    expect(time).toBe(expectTime);
  });
  test('2018-10-25 当年第一天时间戳', () => {
    const time = $date.getLastStart(
      new Date('2018-10-25'),
      'year',
    ).getTime();
    const expectTime = new Date('2018-1-1 00:00').getTime();
    expect(time).toBe(expectTime);
  });
});

describe('date.getTimeSplit', () => {
  test('必须传递 type 参数', () => {
    let hasError = false;
    try {
      $date.getTimeSplit(new Date('2018-10-25'));
    } catch (err) {
      hasError = true;
    }
    expect(hasError).toBe(true);
  });
  test('2018-10-25 当月第1天时间戳', () => {
    const time = $date.getTimeSplit(
      '2018-10-25',
      'month',
    ).getTime();
    const expectTime = new Date('2018-10-1 00:00').getTime();
    expect(time).toBe(expectTime);
  });
  test('2018-10-25 当年第1天时间戳', () => {
    const time = $date.getTimeSplit(
      '2018-10-25',
      'year',
    ).getTime();
    const expectTime = new Date('2018-1-1 00:00').getTime();
    expect(time).toBe(expectTime);
  });
});
