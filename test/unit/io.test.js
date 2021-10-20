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
      url: 'http://127.0.0.1:8080/null',
      data: {
        n1: 'v1',
        n2: 'v2',
      },
      error(xhr, status) {
        expect(status).toBe('error');
        expect(xhr.readyState).toBe(4);
        errorCalled = true;
      },
      success() {
        successCalled = true;
      },
      complete(xhr, status) {
        expect(errorCalled).toBe(true);
        expect(successCalled).toBe(false);
        expect(xhr.readyState).toBe(4);
        expect(xhr.status).toBe(0);
        expect(status).toBe('error');
        done();
      },
    });
  });
});
