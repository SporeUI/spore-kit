const $arr = require('spore-kit-arr');

console.log(
	Object.keys($arr).map(
		name => ('spore-kit-arr/' + name)
	).join('\n')
);

describe('arr.contains', () => {
	test('contains([1, 2], 1) => true', () => {
		expect($arr.contains([1, 2], 1)).toBe(true);
	});
});
