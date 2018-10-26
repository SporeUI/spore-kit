const $fs = require('fs');
const $path = require('path');

let packagesPath = $path.resolve(__dirname, '../packages');
let packagesFiles = $fs.readdirSync(packagesPath);
let childrenFiles = packagesFiles.map(file => {
	let name = file.replace(/.md$/, '');
	return `/packages/${name}`;
});

module.exports = {
	base: '/',
	dest: 'docs',
	title: 'SPORE-KIT',
	serviceWorker: false,
	head: [
		['link', {
			rel: 'icon',
			href: `/static/images/fav.ico`
		}]
	],
	themeConfig: {
		docsDir: 'docs-src',
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
