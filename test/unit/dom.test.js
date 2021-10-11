const $dom = require('spore-kit-dom');

console.log(
	Object.keys($dom).map(
		name => ('spore-kit-dom/' + name)
	).join('\n')
);

describe('dom.isNode', () => {
	test('isNode(document) => true', () => {
		expect(!!$dom.isNode(document)).toBe(true);
		expect(!!$dom.isNode({})).toBe(false);
	});
});
