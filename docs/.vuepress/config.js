const $fs = require('fs');
const $path = require('path');

let packagesPath = $path.resolve(__dirname, '../packages');
let packagesFiles = $fs.readdirSync(packagesPath);
let childrenFiles = packagesFiles.map(file => {
	let name = file.replace(/.md$/, '');
	return `/packages/${name}`;
});

module.exports = {
	base: '/spore-kit/docs/',
	dest: 'docs-dist/docs',
	title: 'SPORE-KIT',
	serviceWorker: false,
	head: [
		['link', {
			rel: 'icon',
			href: `/static/images/favicon.ico`
		}]
	],
	themeConfig: {
		docsDir: 'docs',
		nav: [
			{
				text: '首页',
				link: '/'
			},
			{
				text: 'GITHUB',
				link: 'https://github.com/SporeUI/spore-kit'
			}
		],
		sidebar: [
			{
				title: '简介',
				children: [
					'/'
				]
			},
			{
				title: '参考文档',
				children: childrenFiles
			}
		]
	},
	markdown: {
		lineNumbers: true
	}
}
