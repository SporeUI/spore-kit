<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## spore-kit-io

*   **See**: [https://github.com/SporeUI/spore-kit/tree/master/packages/io][1]

# 处理网络交互

### Examples

```javascript
// 统一引入 spore-kit
var $kit = require('spore-kit');
console.info($kit.io.getScript);

// 单独引入 spore-kit-io
var $io = require('spore-kit-io');
console.info($io.getScript);

// 单独引入一个方法
var $getScript = require('spore-kit-io/getScript');
```

## ajax

*   **See**: [https://github.com/ForbesLindesay/ajax][2]

ajax 请求方法，使用方式与 jQuery, Zepto 类似，对 jQuery, Zepto 无依赖

### Examples

```javascript
document.domain = 'qq.com';
ajax({
	url: 'http://a.qq.com/form',
	data: [{
		n1: 'v1',
		n2: 'v2'
	}],
	success: function (rs) {
		console.info(rs);
	}
});
```

## getScript

加载 script 文件

### Parameters

*   `options` **[Object][3]** 选项

    *   `options.src` **[String][4]** script 地址
    *   `options.charset` **[String][4]** script 编码 (optional, default `'utf-8'`)
    *   `options.onLoad` **[Function][5]?** script 加载完成的回调函数

### Examples

```javascript
getScript({
	src: 'https://code.jquery.com/jquery-3.3.1.min.js',
	onLoad: function () {
		console.info(window.jQuery);
	}
});
```

## iframePost

封装 iframe post 模式

*   requires jQuery/Zepto

### Parameters

*   `spec` **[Object][3]** 请求选项

    *   `spec.form` **[Object][3]** 要请求的表单 (optional, default `null`)
    *   `spec.url` **[String][4]** 请求地址
    *   `spec.data` **([Array][6] | [Object][3])** 请求数据
    *   `spec.target` **[String][4]** 目标 iframe 名称 (optional, default `''`)
    *   `spec.method` **[String][4]** 请求方式 (optional, default `'post'`)
    *   `spec.acceptCharset` **[String][4]** 请求目标的编码 (optional, default `''`)
    *   `spec.jsonp` **[String][4]** 传递给接口的回调参数名称 (optional, default `'callback'`)
    *   `spec.jsonpMethod` **[String][4]** 传递给接口的回调参数的传递方式，可选\['post', 'get'] (optional, default `''`)
    *   `spec.jsonpCallback` **[String][4]** 传递给接口的回调函数名称，默认自动生成 (optional, default `''`)
    *   `spec.jsonpAddParent` **[String][4]** 传递给接口的回调函数名称需要附带的前缀调用路径 (optional, default `''`)
    *   `spec.complete` **[Function][5]?** 获得数据的回调函数
    *   `spec.success` **[Function][5]?** 成功获得数据的回调函数

### Examples

```javascript
document.domain = 'qq.com';
iframePost({
	url: 'http://a.qq.com/form',
	data: [{
		n1: 'v1',
		n2: 'v2'
	}],
	success: function (rs) {
		console.info(rs);
	}
});
```

## loadSdk

sdk 加载统一封装

*   多次调用不会发起重复请求

### Parameters

*   `options` **[Object][3]** 选项

    *   `options.name` **[String][4]** sdk 全局变量名称
    *   `options.url` **[String][4]** script 地址
    *   `options.charset` **[String][4]** script 编码 (optional, default `'utf-8'`)
    *   `options.onLoad` **[Function][5]?** script 加载完成的回调函数

### Examples

```javascript
loadSdk({
	name: 'TencentCaptcha',
	url: 'https://ssl.captcha.qq.com/TCaptcha.js'
}).then(TencentCaptcha => {})
```

[1]: https://github.com/SporeUI/spore-kit/tree/master/packages/io

[2]: https://github.com/ForbesLindesay/ajax

[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array