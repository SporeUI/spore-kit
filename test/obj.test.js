const $obj = require('spore-kit-obj');

console.log(
	Object.keys($obj).map(
		name => ('spore-kit-obj/' + name)
	).join('\n')
);

describe('obj.type', () => {
	test('type(null) => null', () => {
		expect(
			$obj.type(null)
		).toBe('null');
	});
});
