const $fx = require('../../packages/fx');

const $console = console;

function defer(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

$console.log(
  Object.keys($fx).map(
    (name) => (`../../packages/fx/${name}`),
  ).join('\n'),
);

describe('fx.easing', () => {
  test('fx.easing.linear', () => {
    const val = $fx.easing.linear(0.3);
    expect(val).toBe(0.3);
  });

  test('fx.easing.easeInQuad', () => {
    const val = $fx.easing.easeInQuad(0.3);
    expect(val).toBe(0.09);
  });

  test('fx.easing.easeOutQuad', () => {
    const val = $fx.easing.easeOutQuad(0.3);
    expect(val).toBe(0.51);
  });

  test('fx.easing.easeInOutQuad', () => {
    const val = $fx.easing.easeInOutQuad(0.3);
    expect(val).toBe(0.18);
  });

  test('fx.easing.easeInCubic', () => {
    const val = $fx.easing.easeInCubic(0.3);
    expect(val).toBe(0.027);
  });

  test('fx.easing.easeOutCubic', () => {
    const val = $fx.easing.easeOutCubic(0.3);
    expect(val).toBe(0.657);
  });

  test('fx.easing.easeInOutCubic', () => {
    const val = $fx.easing.easeInOutCubic(0.3);
    expect(val).toBe(0.108);
  });

  test('fx.easing.easeInQuart', () => {
    const val = $fx.easing.easeInQuart(0.3);
    expect(val).toBe(0.0081);
  });

  test('fx.easing.easeOutQuart', () => {
    const val = $fx.easing.easeOutQuart(0.3);
    expect(val).toBe(0.7599);
  });

  test('fx.easing.easeInOutQuart', () => {
    const val = $fx.easing.easeInOutQuart(0.3);
    expect(val).toBe(0.0648);
  });

  test('fx.easing.easeInQuint', () => {
    const val = $fx.easing.easeInQuint(0.3);
    expect(val).toBe(0.00243);
  });

  test('fx.easing.easeOutQuint', () => {
    const val = $fx.easing.easeOutQuint(0.3);
    expect(val).toBe(0.8319300000000001);
  });

  test('fx.easing.easeInOutQuint', () => {
    const val = $fx.easing.easeInOutQuint(0.3);
    expect(val).toBe(0.03888);
  });
});

describe('fx.flashAction', () => {
  test('闪烁动作交替进行', async () => {
    const arr = [];
    let va = 0;
    let vb = 10;
    $fx.flashAction({
      times: 2,
      delay: 10,
      actionOdd() {
        va += 1;
        arr.push(va);
      },
      actionEven() {
        vb += 1;
        arr.push(vb);
      },
      recover() {
        arr.push('f');
      },
    });
    await defer(100);
    expect(arr.length).toBe(5);
    expect(arr[0]).toBe(11);
    expect(arr[1]).toBe(1);
    expect(arr[2]).toBe(12);
    expect(arr[3]).toBe(2);
    expect(arr[4]).toBe('f');
  });
});

describe('fx.Fx', () => {
  const Fx = $fx.Fx;

  test('动画函数正常执行', async () => {
    const arr = [];
    const fx = new Fx({
      duration: 200,
    });
    fx.set = function (now) {
      arr.push(now);
    };
    fx.on('complete', () => {
      arr.push('f');
    });
    fx.start(0, 100);
    await defer(300);

    expect(arr.length).toBeGreaterThan(3);
    expect(arr[0]).toBe(0);
    expect(arr[1]).toBeGreaterThan(0);
    expect(arr[1]).toBeLessThan(100);
    expect(arr[arr.length - 2]).toBe(100);
    expect(arr[arr.length - 1]).toBe('f');
  });

  test('动画可暂停和恢复', async () => {
    const arr = [];
    const fx = new Fx({
      duration: 200,
    });
    fx.set = function (now) {
      arr.push(now);
    };
    fx.on('complete', () => {
      arr.push('f');
    });
    fx.start(0, 100);

    await defer(100);
    fx.pause();

    expect(arr[0]).toBe(0);
    expect(arr[1]).toBeGreaterThan(0);
    expect(arr[arr.length - 1]).not.toBe('f');

    fx.resume();
    await defer(300);

    expect(arr[arr.length - 3]).toBeLessThan(100);
    expect(arr[arr.length - 2]).toBe(100);
    expect(arr[arr.length - 1]).toBe('f');
  });

  test('默认动画结束前，忽略新传入的动画参数', async () => {
    const arr = [];
    const fx = new Fx({
      duration: 200,
    });
    fx.set = function (now) {
      arr.push(now);
    };
    fx.on('cancel', () => {
      arr.push('c');
    });
    fx.on('complete', () => {
      arr.push('f');
    });
    fx.start(0, 100);

    await defer(100);
    fx.start(0, 200);

    expect(arr[0]).toBe(0);
    expect(arr[1]).toBeGreaterThan(0);

    await defer(300);

    expect(arr[arr.length - 1]).toBe('f');
    expect(arr.indexOf('c') < 0).toBe(true);
  });

  test('动画可取消后接续执行下一个动画', async () => {
    const arr = [];
    const fx = new Fx({
      duration: 200,
      link: 'cancel',
    });
    fx.set = function (now) {
      arr.push(now);
    };
    fx.on('cancel', () => {
      arr.push('c');
    });
    fx.on('complete', () => {
      arr.push('f');
    });
    fx.start(0, 100);

    await defer(100);
    fx.start(0, 200);

    expect(arr[0]).toBe(0);
    expect(arr[1]).toBeGreaterThan(0);
    expect(arr[arr.length - 1]).toBe('c');

    await defer(300);

    expect(arr[arr.length - 2]).toBeGreaterThan(100);
    expect(arr[arr.length - 1]).toBe('f');
  });

  test('动画可直接终止', async () => {
    const arr = [];
    const fx = new Fx();
    fx.setOptions({
      duration: 200,
    });
    fx.on('stop', () => {
      arr.push('s');
    });
    fx.on('complete', () => {
      arr.push('f');
    });
    fx.start(0, 100);

    await defer(100);
    fx.stop();

    expect(arr.indexOf('f') < 0).toBe(true);
    expect(arr[arr.length - 1]).toBe('s');
  });
});

describe('fx.smoothScrollTo', () => {
  test('可执行滚动动画', async () => {
    const root = $('<div class="smooth-scroll-demo"></div>');
    root.appendTo(document.body);
    let winScrollY = 0;
    const arr = [];
    window.scrollTo = jest.fn().mockImplementation((vx, vy) => {
      winScrollY = vy;
      arr.push(vy);
    });
    $.fn.scrollTop = jest.fn().mockImplementation(() => winScrollY);
    $.fn.offset = jest.fn().mockReturnValueOnce({
      top: 1000,
    });

    let scrollEnded = false;
    $fx.smoothScrollTo(root.get(0), {
      maxDelay: 300,
      callback() {
        scrollEnded = true;
      },
    });
    await defer(500);

    expect(arr.length).toBeGreaterThan(0);
    expect(arr[1]).toBeGreaterThan(0);
    expect(arr[1]).toBeLessThan(1000);
    expect(arr[arr.length - 2]).toBeLessThan(1000);
    expect(arr[arr.length - 1]).toBe(1000);
    expect(scrollEnded).toBe(true);
  });
});

describe('fx.sticky', () => {
  test('滚动超过元素位置后，元素设置为 fixed 样式', async () => {
    const root = $('<div class="sticky-demo"></div>');
    root.appendTo(document.body);
    $.fn.offsetParent = jest
      .fn()
      .mockImplementation(() => $(document.body));
    window.scrollY = 100;
    $fx.sticky(root.get(0));
    expect(root.css('position')).toBe('fixed');
  });
});

describe('fx.transitions', () => {
  test('transitions.linear', () => {
    const {
      linear,
    } = $fx.transitions;
    expect(linear(0.3)).toBe(0.3);
  });

  test('transitions.Pow', () => {
    const {
      easeIn,
      easeOut,
      easeInOut,
    } = $fx.transitions.Pow;
    expect(easeIn(0.3)).toBe(0.0007289999999999998);
    expect(easeOut(0.3)).toBe(0.8823510000000001);
    expect(easeInOut(0.3)).toBe(0.023327999999999995);
  });

  test('transitions.Expo', () => {
    const {
      easeIn,
      easeOut,
      easeInOut,
    } = $fx.transitions.Expo;
    expect(easeIn(0.3)).toBe(0.02061731110582648);
    expect(easeOut(0.3)).toBe(0.8105354291862003);
    expect(easeInOut(0.3)).toBe(0.05440941020600775);
  });

  test('transitions.Circ', () => {
    const {
      easeIn,
      easeOut,
      easeInOut,
    } = $fx.transitions.Circ;
    expect(easeIn(0.3)).toBe(0.04606079858305434);
    expect(easeOut(0.3)).toBe(0.714142842854285);
    expect(easeInOut(0.3)).toBe(0.09999999999999998);
  });

  test('transitions.Sine', () => {
    const {
      easeIn,
      easeOut,
      easeInOut,
    } = $fx.transitions.Sine;
    expect(easeIn(0.3)).toBe(0.1089934758116321);
    expect(easeOut(0.3)).toBe(0.45399049973954686);
    expect(easeInOut(0.3)).toBe(0.20610737385376343);
  });

  test('transitions.Back', () => {
    const {
      easeIn,
      easeOut,
      easeInOut,
    } = $fx.transitions.Back;
    expect(easeIn(0.3)).toBe(-0.074934);
    expect(easeOut(0.3)).toBe(0.894846);
    expect(easeInOut(0.3)).toBe(-0.008495999999999983);
  });

  test('transitions.Bounce', () => {
    const {
      easeIn,
      easeOut,
      easeInOut,
    } = $fx.transitions.Bounce;
    expect(easeIn(0.3)).toBe(0.06937499999999996);
    expect(easeOut(0.3)).toBe(0.6806250000000003);
    expect(easeInOut(0.3)).toBe(0.04500000000000004);
  });

  test('transitions.Elastic', () => {
    const {
      easeIn,
      easeOut,
      easeInOut,
    } = $fx.transitions.Elastic;
    expect(easeIn(0.3)).toBe(-0.003906249999999992);
    expect(easeOut(0.3)).toBe(0.875);
    expect(easeInOut(0.3)).toBe(-0.015624999999999976);
  });

  test('transitions.Quad', () => {
    const {
      easeIn,
      easeOut,
      easeInOut,
    } = $fx.transitions.Quad;
    expect(easeIn(0.3)).toBe(0.09);
    expect(easeOut(0.3)).toBe(0.51);
    expect(easeInOut(0.3)).toBe(0.18);
  });

  test('Fx.getTransition', () => {
    const inst = new $fx.Fx();
    inst.getTransition = $fx.Fx.getTransition;
    const fn = inst.getTransition();
    expect(fn(0.3)).toBe(0.20610737385376343);
  });

  test('自定义动画选项', () => {
    const inst = new $fx.Fx({
      transition: 'Sine:In:Out',
    });
    inst.getTransition = $fx.Fx.getTransition;
    const fn = inst.getTransition();
    expect(typeof fn).toBe('function');
    expect(fn(0.3)).toBe(0.20610737385376343);
  });
});
