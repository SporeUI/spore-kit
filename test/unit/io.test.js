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
    $io.ajax.post(url, { a: 1 }, (rs) => {
      expect(rs.code).toBe(200);
    }, 'json');
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
