module.exports = {
  base: '/spore-kit/docs/',
  dest: 'docs-dist/docs',
  title: 'SPORE-KIT',
  serviceWorker: false,
  head: [
    ['link', {
      rel: 'icon',
      href: '/imgs/favicon.ico',
    }],
  ],
  themeConfig: {
    docsDir: 'docs',
    nav: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: 'GITHUB',
        link: 'https://github.com/SporeUI/spore-kit',
      },
    ],
    sidebar: [
      {
        title: '简介',
        path: '/',
      },
      {
        title: '参考文档',
        path: '/docs',
      },
    ],
  },
  markdown: {
    lineNumbers: true,
  },
};
