/**
 * 如果觉得规则不合适, 可以在rules中对规则进行覆盖
 * 配置规则 http://eslint.org/docs/user-guide/configuring (可切换为中文)
 * "off" or 0 - turn the rule off
 * "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
 * "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
 */

module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 5,
		sourceType: 'module'
	},
	env: {
		browser: true,
		jest: true
	},
	extends: 'airbnb-base',
	plugins: [
		'html',
		'jest',
		'no-for-of-loops'
	],
	settings: {
		'html/html-extensions': [
			'.html',
			'.vue'
		]
	},
	globals: {
		$: true,
		page: true,
		browser: true,
		console: true
	},
	// add your custom rules here
	rules: {
		// allow optionalDependencies
		'import/no-extraneous-dependencies': 0,
		// 由于用了 lerna, 包依赖关系 eslint 无法识别
		'import/no-unresolved': 0,
		// 函数声明括号前无需加空格，这样与 beautify 格式化方案可直接匹配
		// 箭头函数前加 async 会导致 [2, "never"] 规则的报错
		'space-before-function-paren': 0,
		// 禁止++运算符
		'no-plusplus': 0,
		// 不允许修改参数
		'no-param-reassign': 0,
		// 避免引号属性名
		'quote-props': 0,
		// 函数应当具名
		'func-names': 0,
		// 使用字符串模板，而不是+
		'prefer-template': 0,
		// 在定义对象或数组时，最后一项不能加逗号
		'comma-dangle': [2, 'never'],
		// 箭头函数中，在需要的时候，在参数外使用小括号（只有一个参数时，可以不适用括号，其它情况下都需要使用括号）
		'arrow-parens': [2, 'as-needed'],
		// 要求使用 const 来声明变量
		'prefer-const': 0,
		// 无tab
		'no-tabs': 0,
		// 避免用 var 声明变量
		'no-var': 0,
		// var 声明放到函数开头
		'vars-on-top': 0,
		// 允许控制台输出
		'no-console': 0,
		// 禁止正则中出现控制字符
		'no-control-regex': 0,
		// 总是使用箭头函数
		'prefer-arrow-callback': 0,
		// 规定 require 必须放在代码顶部，这对 require.ensure 有影响
		'global-require': 0,
		// 不在 else 中 return
		'no-else-return': 0,
		// 用什么来缩进，规定使用tab 来进行缩进，switch中case也需要一个tab
		'indent': [2, 'tab', {
			'SwitchCase': 1
		}],
		// 推荐使用解构赋值
		'prefer-destructuring': 0,
		// 要求 promise 必须返回 Error 对象
		'prefer-promise-reject-errors': 0,
		// 检查 function 之后括号里面的参数是否可以换行
		'function-paren-newline': 0,
		// 管理代码中是否可以 return value
		'consistent-return': 0,
		// es5 相关配置
		'prefer-spread': 0,
		'no-continue': 0,
		'object-shorthand': 0,
		'prefer-rest-params': 0,
		'no-restricted-syntax': 0,
		'no-prototype-builtins': 0,
		'no-underscore-dangle': 0,
		'no-restricted-properties': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
	}
};
