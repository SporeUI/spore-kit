const $obj = require('spore-kit-obj');
const assert = require('assert');

console.log(
	Object.keys($obj).map(
		name => ('spore-kit-obj/' + name)
	).join('\n')
);

describe('obj.type', () => {
	test('type(null) => null', () => {
		assert($obj.type(null) === 'null');
	});
});
