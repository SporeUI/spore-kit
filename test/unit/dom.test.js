const $dom = require('../../packages/dom');

console.log(
	Object.keys($dom).map(
		name => ('../../packages/dom/' + name)
	).join('\n')
);

describe('dom.isNode', () => {
	test('isNode(document) => true', () => {
		expect(!!$dom.isNode(document)).toBe(true);
		expect(!!$dom.isNode({})).toBe(false);
	});
});
