const $io = require('../../packages/io');

const $console = console;

$console.log(
  Object.keys($io).map(
    (name) => (`../../packages/io/${name}`),
  ).join('\n'),
);

describe('io.ajax', () => {
  test('普通请求', (done) => {
    let errorCalled = false;
    let successCalled = false;
    $io.ajax({
      url: 'https://sporeui.github.io/spore-kit/docs/js/info.json',
      data: {
        n1: 'v1',
        n2: 'v2',
      },
      dataType: 'json',
      error() {
        errorCalled = true;
      },
      success(rs) {
        expect(rs.code).toBe(200);
        expect(rs.data.a).toBe(3);
        successCalled = true;
      },
      complete(xhr, status) {
        expect(errorCalled).toBe(false);
        expect(successCalled).toBe(true);
        expect(xhr.readyState).toBe(4);
        expect(xhr.status).toBe(200);
        expect(status).toBe('success');
        done();
      },
    });
  });

  test('错误请求', (done) => {
    let errorCalled = false;
    let successCalled = false;
    $io.ajax({
      url: 'https://sporeui.github.io/spore-kit/docs/js/null.json',
      data: {
        n1: 'v1',
        n2: 'v2',
      },
      dataType: 'json',
      error(xhr, status) {
        expect(status).toBe('error');
        errorCalled = true;
      },
      success() {
        successCalled = true;
      },
      complete(xhr, status) {
        expect(errorCalled).toBe(true);
        expect(successCalled).toBe(false);
        expect(xhr.status).toBe(404);
        expect(status).toBe('error');
        done();
      },
    });
  });

  test('getJSON', (done) => {
    const url = 'https://sporeui.github.io/spore-kit/docs/js/info.json';
    $io.ajax.getJSON(url, (rs) => {
      expect(rs.code).toBe(200);
      done();
    });
  });

  test('get', (done) => {
    const url = 'https://sporeui.github.io/spore-kit/docs/js/info.json';
    $io.ajax.get(url, (rs) => {
      expect(typeof rs).toBe('string');
      done();
    });
  });

  test('timeout', (done) => {
    let errorCalled = false;
    let successCalled = false;
    $io.ajax({
      url: 'https://sporeui.github.io/spore-kit/docs/js/info.json',
      data: {
        n1: 'v1',
        n2: 'v2',
      },
      dataType: 'json',
      timeout: 1,
      error() {
        errorCalled = true;
      },
      success() {
        successCalled = true;
      },
      complete(xhr, status) {
        expect(errorCalled).toBe(true);
        expect(successCalled).toBe(false);
        expect(xhr.readyState).toBe(0);
        expect(status).toBe('timeout');
        done();
      },
    });
  });

  test('JSONP', (done) => {
    let completeCalled = false;
    let successCalled = false;
    $io.ajax({
      url: 'https://sporeui.github.io/spore-kit/docs/js/test.js',
      dataType: 'jsonp',
      timeout: 1,
      success() {
        successCalled = true;
      },
      complete(xhr, status) {
        if (!completeCalled) {
          expect(successCalled).toBe(false);
          expect(status).toBe('abort');
          completeCalled = true;
          done();
        }
      },
    });
  });
});

describe('io.getScript', () => {
  test('正常加载远程脚本', (done) => {
    const url = 'https://sporeui.github.io/spore-kit/docs/js/test.js';
    const script = $io.getScript({
      src: url,
      charset: 'utf8',
      onLoad() {
        const scriptNode = $('head').find(`script[src="${url}"]`);
        expect(scriptNode.length).toBeGreaterThan(0);
        done();
      },
    });
    script.onload();
  });
});

describe('io.loadSdk', () => {
  test('正常加载 sdk', (done) => {
    const url = 'https://sporeui.github.io/spore-kit/docs/js/test.js?action=loadsdk';
    let cbCount = 0;
    $io.loadSdk({
      name: 'callbackValue',
      url,
    }).then((val) => {
      cbCount += 1;
      expect(val).toBe(1234);
    });
    $io.loadSdk({
      name: 'callbackValue',
      url,
    }).then((val) => {
      cbCount += 1;
      expect(val).toBe(1234);
      expect(cbCount).toBe(2);
      done();
    });
    const scriptNode = $('head').find(`script[src="${url}"]`);
    expect(scriptNode.length).toBe(1);
    setTimeout(() => {
      window.callbackValue = 1234;
      scriptNode.get(0).onload();
    }, 10);
  });

  test('缺失参数会有报错', async () => {
    let err1 = null;
    let err2 = null;
    try {
      await $io.loadSdk({
        name: 'callbackValue',
      });
    } catch (err) {
      err1 = err;
    }
    expect(err1).not.toBeNull();

    try {
      await $io.loadSdk({
        url: 'none',
      });
    } catch (err) {
      err2 = err;
    }
    expect(err2).not.toBeNull();
  });
});

describe('io.iframePost', () => {
  test('正常加载 post 请求', (done) => {
    const url = 'https://sporeui.github.io/spore-kit/docs/js/info.json';
    let submitCalled = false;
    window.HTMLFormElement.prototype.submit = jest.fn().mockImplementation(() => {
      submitCalled = true;
    });

    let successCalled = false;
    const inst = $io.iframePost({
      url,
      data: [{
        n1: 'v1',
      }, {
        n2: 'v2',
      }],
      success(rs) {
        successCalled = true;
        expect(rs.val).toBe(42);
        done();
      },
      complete() {
        expect(successCalled).toBe(true);
        done();
      },
    });

    window[inst.jsonpCallback]({
      val: 42,
    });
    expect(submitCalled).toBe(true);
  });

  test('正常加载 get 请求', (done) => {
    const url = 'https://sporeui.github.io/spore-kit/docs/js/info.json';
    const inst = $io.iframePost({
      url,
      jsonpMethod: 'get',
      target: 'iframe-name',
      acceptCharset: 'utf8',
      data: {
        n1: 'v1',
        n2: 'v2',
      },
      success(rs) {
        expect(rs.val).toBe(43);
        done();
      },
    });

    window[inst.jsonpCallback]({
      val: 43,
    });
  });
});
