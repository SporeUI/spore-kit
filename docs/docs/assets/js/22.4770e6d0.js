(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{479:function(t,e,a){"use strict";a.r(e);var s=a(58),r=Object(s.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"spore-kit-str"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#spore-kit-str"}},[t._v("#")]),t._v(" spore-kit-str")]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("See")]),t._v(": "),a("a",{attrs:{href:"https://github.com/SporeUI/spore-kit/tree/master/packages/str",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/SporeUI/spore-kit/tree/master/packages/str"),a("OutboundLink")],1)])]),t._v(" "),a("h1",{attrs:{id:"字符串处理与判断"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#字符串处理与判断"}},[t._v("#")]),t._v(" 字符串处理与判断")]),t._v(" "),a("h3",{attrs:{id:"examples"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 统一引入 spore-kit")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" $kit "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'spore-kit'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("info")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("$kit"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("str"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("substitute"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 单独引入 spore-kit-str")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" $str "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'spore-kit-str'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("info")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("$str"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("substitute"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 单独引入一个方法")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" $substitute "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'spore-kit-str/substitute'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br")])]),a("h2",{attrs:{id:"blength"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#blength"}},[t._v("#")]),t._v(" bLength")]),t._v(" "),a("p",[t._v("获取字符串长度，一个中文算2个字符")]),t._v(" "),a("h3",{attrs:{id:"parameters"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("str")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 要计算长度的字符串")])]),t._v(" "),a("h3",{attrs:{id:"examples-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-2"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("bLength")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'中文cc'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 6")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number",target:"_blank",rel:"noopener noreferrer"}},[t._v("Number"),a("OutboundLink")],1)]),t._v(" 字符串长度")]),t._v(" "),a("h2",{attrs:{id:"dbctosbc"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#dbctosbc"}},[t._v("#")]),t._v(" dbcToSbc")]),t._v(" "),a("p",[t._v("全角字符转半角字符")]),t._v(" "),a("h3",{attrs:{id:"parameters-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters-2"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("str")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 包含了全角字符的字符串")])]),t._v(" "),a("h3",{attrs:{id:"examples-3"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-3"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("dbcToSbc")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'ＳＡＡＳＤＦＳＡＤＦ'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 'SAASDFSADF'")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 经过转换的字符串")]),t._v(" "),a("h2",{attrs:{id:"decodehtml"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#decodehtml"}},[t._v("#")]),t._v(" decodeHTML")]),t._v(" "),a("p",[t._v("解码HTML，将实体字符转换为HTML字符")]),t._v(" "),a("h3",{attrs:{id:"parameters-3"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters-3"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("str")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 含有实体字符的字符串")])]),t._v(" "),a("h3",{attrs:{id:"examples-4"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-4"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("decodeHTML")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'&amp;&lt;&gt;&quot;&#39;&#32;'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// '&<>\"\\' '")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" HTML字符串")]),t._v(" "),a("h2",{attrs:{id:"encodehtml"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#encodehtml"}},[t._v("#")]),t._v(" encodeHTML")]),t._v(" "),a("p",[t._v("编码HTML，将HTML字符转为实体字符")]),t._v(" "),a("h3",{attrs:{id:"parameters-4"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters-4"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("str")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 含有HTML字符的字符串")])]),t._v(" "),a("h3",{attrs:{id:"examples-5"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-5"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("encodeHTML")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token template-string"}},[a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("&<>\"\\' ")]),a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// '&amp;&lt;&gt;&quot;&#39;&#32;'")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 经过转换的字符串")]),t._v(" "),a("h2",{attrs:{id:"getrnd36"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getrnd36"}},[t._v("#")]),t._v(" getRnd36")]),t._v(" "),a("p",[t._v("获取36进制随机字符串")]),t._v(" "),a("h3",{attrs:{id:"parameters-5"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters-5"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("rnd")]),t._v(" "),a("strong",[t._v("Float?")]),t._v(" 随机数，不传则生成一个随机数")])]),t._v(" "),a("h3",{attrs:{id:"examples-6"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-6"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getRnd36")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.5810766832590446")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 'kx2pozz9rgf'")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 转成为36进制的字符串")]),t._v(" "),a("h2",{attrs:{id:"gettime36"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#gettime36"}},[t._v("#")]),t._v(" getTime36")]),t._v(" "),a("p",[t._v("获取36进制日期字符串")]),t._v(" "),a("h3",{attrs:{id:"parameters-6"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters-6"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("date")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date",target:"_blank",rel:"noopener noreferrer"}},[t._v("Date"),a("OutboundLink")],1),t._v("?")]),t._v(" 符合规范的日期字符串或者数字，不传参数则使用当前客户端时间")])]),t._v(" "),a("h3",{attrs:{id:"examples-7"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-7"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getTime36")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'2020'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 'k4ujaio0'")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 转成为36进制的字符串")]),t._v(" "),a("h2",{attrs:{id:"getuniquekey"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getuniquekey"}},[t._v("#")]),t._v(" getUniqueKey")]),t._v(" "),a("p",[t._v("生成一个不与之前重复的随机字符串")]),t._v(" "),a("h3",{attrs:{id:"examples-8"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-8"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getUniqueKey")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// '166aae1fa9f'")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 随机字符串")]),t._v(" "),a("h2",{attrs:{id:"hyphenate"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#hyphenate"}},[t._v("#")]),t._v(" hyphenate")]),t._v(" "),a("p",[t._v("将驼峰格式变为连字符格式")]),t._v(" "),a("h3",{attrs:{id:"parameters-7"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters-7"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("str")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 驼峰格式的字符串")])]),t._v(" "),a("h3",{attrs:{id:"examples-9"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-9"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("hyphenate")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'libKitStrHyphenate'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 'lib-kit-str-hyphenate'")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 连字符格式的字符串")]),t._v(" "),a("h2",{attrs:{id:"iptohex"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#iptohex"}},[t._v("#")]),t._v(" ipToHex")]),t._v(" "),a("p",[t._v("十进制IP地址转十六进制")]),t._v(" "),a("h3",{attrs:{id:"parameters-8"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters-8"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("ip")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 十进制数字的IPV4地址")])]),t._v(" "),a("h3",{attrs:{id:"examples-10"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-10"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("ipToHex")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'255.255.255.255'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//return 'ffffffff'")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 16进制数字IPV4地址")]),t._v(" "),a("h2",{attrs:{id:"leftb"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#leftb"}},[t._v("#")]),t._v(" leftB")]),t._v(" "),a("p",[t._v("从左到右取字符串，中文算两个字符")]),t._v(" "),a("h3",{attrs:{id:"parameters-9"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters-9"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("str")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)])]),t._v(" "),a("li",[a("code",[t._v("lens")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number",target:"_blank",rel:"noopener noreferrer"}},[t._v("Number"),a("OutboundLink")],1)])])]),t._v(" "),a("h3",{attrs:{id:"examples-11"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-11"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//向汉编致敬")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("leftB")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'世界真和谐'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("6")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// '世界真'")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" str")]),t._v(" "),a("h2",{attrs:{id:"sizeofutf8string"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sizeofutf8string"}},[t._v("#")]),t._v(" sizeOfUTF8String")]),t._v(" "),a("p",[t._v("取字符串 utf8 编码长度，from 王集鹄")]),t._v(" "),a("h3",{attrs:{id:"parameters-10"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters-10"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("str")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)])])]),t._v(" "),a("h3",{attrs:{id:"examples-12"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-12"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sizeOfUTF8String")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'中文cc'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//return 8")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number",target:"_blank",rel:"noopener noreferrer"}},[t._v("Number"),a("OutboundLink")],1)]),t._v(" 字符串长度")]),t._v(" "),a("h2",{attrs:{id:"substitute"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#substitute"}},[t._v("#")]),t._v(" substitute")]),t._v(" "),a("p",[t._v("简单模板函数")]),t._v(" "),a("h3",{attrs:{id:"parameters-11"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parameters-11"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("str")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 要替换模板的字符串")]),t._v(" "),a("li",[a("code",[t._v("obj")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object",target:"_blank",rel:"noopener noreferrer"}},[t._v("Object"),a("OutboundLink")],1)]),t._v(" 模板对应的数据对象")]),t._v(" "),a("li",[a("code",[t._v("reg")]),t._v(" "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp",target:"_blank",rel:"noopener noreferrer"}},[t._v("RegExp"),a("OutboundLink")],1)]),t._v(" 解析模板的正则表达式 (optional, default "),a("code",[t._v("/\\\\?\\{\\{([^{}]+)\\}\\}/g")]),t._v(")")])]),t._v(" "),a("h3",{attrs:{id:"examples-13"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples-13"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("substitute")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'{{city}}欢迎您'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("city"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'北京'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// '北京欢迎您'")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Returns "),a("strong",[a("a",{attrs:{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",target:"_blank",rel:"noopener noreferrer"}},[t._v("String"),a("OutboundLink")],1)]),t._v(" 替换了模板的字符串")])])}),[],!1,null,null,null);e.default=r.exports}}]);