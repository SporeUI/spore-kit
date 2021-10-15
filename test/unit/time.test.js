const $time = require('../../packages/time');

const $console = console;

$console.log(
  Object.keys($time).map(
    (name) => (`../../packages/time/${name}`),
  ).join('\n'),
);

describe('time.parseUnit', () => {
  test('parseUnit(12345 * 67890).day => 9', () => {
    const udate = $time.parseUnit(12345 * 67890);
    expect(udate.day).toBe(9);
  });
});

describe('time.countDown', () => {
  test('提供定时触发能力', (done) => {
    const target = Date.now() + 150;
    let step = 0;
    $time.countDown({
      target,
      interval: 50,
      onChange(delta) {
        expect(typeof delta).toBe('number');
        step += 1;
      },
      onStop(delta) {
        expect(step).toBe(4);
        expect(delta).toBeLessThanOrEqual(0);
        setTimeout(() => {
          expect($time.countDown.allMonitors[10]).toBe(null);
          done();
        }, 100);
      },
    });
  });

  test('定时器可提前终止', (done) => {
    const target = Date.now() + 250;
    let step = 0;
    const cd1 = $time.countDown({
      target,
      interval: 50,
      onChange(delta) {
        expect(typeof delta).toBe('number');
        step += 1;
      },
      onStop(delta) {
        expect(step).toBe(3);
        expect(delta).toBeGreaterThanOrEqual(100);
        done();
      },
    });
    setTimeout(() => {
      cd1.stop();
    }, 120);
  });

  test('销毁定时器，不会执行后续回调', (done) => {
    const target = Date.now() + 250;
    let step = 0;
    let stopCalled = false;
    const cd1 = $time.countDown({
      target,
      interval: 50,
      onChange(delta) {
        expect(typeof delta).toBe('number');
        step += 1;
      },
      onStop() {
        stopCalled = true;
      },
    });
    setTimeout(() => {
      cd1.destroy();
      setTimeout(() => {
        expect(step).toBe(3);
        expect(stopCalled).toBe(false);
        done();
      }, 50);
    }, 120);
  });

  test('设置服务器时间可以校准定时器', (done) => {
    const target = Date.now() + 150;
    let step = 0;
    $time.countDown({
      base: Date.now() + 60,
      target,
      interval: 50,
      onChange() {
        step += 1;
      },
      onStop() {
        expect(step).toBe(3);
        done();
      },
    });
  });

  test('可重设目标时间', (done) => {
    let step = 0;
    const now = Date.now();
    const target1 = now + 150;
    const target2 = now + 250;
    const cd1 = $time.countDown({
      target: target1,
      interval: 50,
      onChange() {
        step += 1;
      },
      onStop() {
        expect(step).toBe(6);
        done();
      },
    });
    setTimeout(() => {
      cd1.setTarget(target2);
    }, 100);
  });
});
