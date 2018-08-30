/*
如果觉得规则不合适, 可以在rules中对规则进行覆盖
配置规则 http://eslint.org/docs/user-guide/configuring (可切换为中文)
"off" or 0 - turn the rule off
"warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
"error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
*/

module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true
	},
	extends: 'airbnb-base',
	plugins: [
		'html',
		'no-for-of-loops'
	],
	settings: {
		'html/html-extensions': [
			'.html',
			'.vue'
		],
	},
	globals: {
		$: true,
		Zepto: true,
		jQuery: true,
		console: true,
		$CONFIG: true
	},
	// add your custom rules here
	rules: {
		// allow optionalDependencies
		'import/no-extraneous-dependencies': 0,
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
		// 无console
		'no-console': 0,
		// 规定 require 必须放在代码顶部，这对 require.ensure 有影响
		'global-require': 0,
		// 不在 else 中 return
		'no-else-return': 0,
		// 用什么来缩进，规定使用tab 来进行缩进，switch中case也需要一个tab .
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
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
	}
};
