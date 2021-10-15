const $evt = require('../../packages/evt');

const $console = console;

$console.log(
  Object.keys($evt).map(
    (name) => (`../../packages/evt/${name}`),
  ).join('\n'),
);

describe('evt.events', () => {
  const $events = $evt.Events;

  test('实现正常的事件绑定能力', () => {
    const inst = new $events();
    let index = 0;
    inst.on('change', (val) => {
      index += val;
    });
    inst.trigger('change', 2);
    expect(index).toBe(2);
  });

  test('事件可以解绑', () => {
    const inst = new $events();
    let va = 0;
    let vb = 10;
    const fn1 = () => {
      va += 1;
    };
    const fn2 = () => {
      vb += 1;
    };
    inst.on('change', fn1);
    inst.on('change', fn2);
    inst.trigger('change');
    expect(va).toBe(1);
    expect(vb).toBe(11);

    inst.off('change', fn1);
    inst.trigger('change');
    expect(va).toBe(1);
    expect(vb).toBe(12);
  });

  test('事件可以挂载到对象', () => {
    const obj = {
      a: 1,
      updateA() {
        this.a += 1;
      },
    };
    $events.mixTo(obj);
    obj.on('update-a', obj.updateA.bind(obj));
    obj.trigger('update-a');
    expect(obj.a).toBe(2);
  });

  test('可以通过 all 参数监听所有事件', () => {
    const inst = new $events();
    let va = 0;
    let vb = 10;
    const fn1 = () => {
      va += 1;
    };
    const fn2 = () => {
      vb += 1;
    };
    inst.on('change', fn1);
    inst.on('all', fn2);
    inst.trigger('change');
    expect(va).toBe(1);
    expect(vb).toBe(11);
  });

  test('可以触发多个事件', () => {
    const inst = new $events();
    let va = 0;
    let vb = 10;
    const fn1 = () => {
      va += 1;
    };
    const fn2 = () => {
      vb += 1;
    };
    inst.on('change-a', fn1);
    inst.on('change-b', fn2);
    inst.trigger('change-a change-b');
    expect(va).toBe(1);
    expect(vb).toBe(11);
  });

  test('未绑定的事件也可以操作方法', () => {
    const inst = new $events();
    let err = null;
    try {
      inst.on('change');
      inst.trigger('change');
      inst.off();
    } catch (error) {
      err = error;
    }
    expect(err).toBeNull();
  });

  test('可以解绑指定的多个事件', () => {
    const inst = new $events();
    let va = 0;
    let vb = 10;
    const fn1 = () => {
      va += 1;
    };
    const fn2 = () => {
      vb += 1;
    };
    inst.on('change-a', fn1);
    inst.on('change-b', fn2);
    inst.off('change-a change-b change-c');
    inst.trigger('change-a change-b change-c');
    expect(va).toBe(0);
    expect(vb).toBe(10);
  });

  test('可以解绑全部事件', () => {
    const inst = new $events();
    let va = 0;
    let vb = 10;
    const fn1 = () => {
      va += 1;
    };
    const fn2 = () => {
      vb += 1;
    };
    inst.on('change-a', fn1);
    inst.on('change-b', fn2);
    inst.off();
    inst.trigger('change-a change-b change-c');
    expect(va).toBe(0);
    expect(vb).toBe(10);
  });

  test('事件可以批量解绑', () => {
    const inst = new $events();
    let va = 0;
    let vb = 10;
    const fn1 = () => {
      va += 1;
    };
    const fn2 = () => {
      vb += 1;
    };
    inst.on('change', fn1);
    inst.on('change', fn2);
    inst.trigger('change');
    expect(va).toBe(1);
    expect(vb).toBe(11);

    inst.off('change');
    inst.trigger('change');
    expect(va).toBe(1);
    expect(vb).toBe(11);
  });
});
