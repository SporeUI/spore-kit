# Spore-Kit

![npm](https://img.shields.io/npm/v/spore-kit)
![license](https://img.shields.io/npm/l/spore-kit)
[![GitHub Pages Actions](https://github.com/SporeUI/sporeui.github.io/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/SporeUI/sporeui.github.io/actions/workflows/node.js.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![action-release](https://github.com/SporeUI/spore-kit/workflows/release/badge.svg)
[![codecov](https://codecov.io/gh/SporeUI/spore-kit/branch/master/graph/badge.svg)](https://codecov.io/gh/TabSpace/colorogger)

原子化工具函数库

[releases and changelog](https://github.com/SporeUI/spore-kit/releases)

## 参考文档

[https://sporeui.github.io/spore-kit/docs/](https://sporeui.github.io/spore-kit/docs/)

## 何时使用

虽然已经有了 underscore, lodash 这样优秀的工具库，但是日常开发中还是有很多常用的方法并未囊括在其中。

本工具库意图在日常业务积累中，留存各种常见工具函数，解决方案，Hack方案。

同时，也作为一个目录，整合线上一些优秀的工具库与工具函数，作为一批优秀工具库的索引，提供一些工具的快速使用封装。

工具函数进行了分门别类的梳理，推荐使用时引用确定版本，直接引用函数，可以直接减少代码打包体积。

## 快速上手

```shell
# 整体引入
npm i spore-kit

# 引入一个独立模块
npm i spore-kit-arr
```

```javascript
// 统一引入 spore-kit
var $kit = require('spore-kit');
console.info($kit.arr.contains); //function

// 单独引入 spore-kit-arr
var $arr = require('spore-kit-arr');
console.info($arr.contains); //function

// 单独引入一个方法（推荐）
var $contains = require('spore-kit-arr/contains');
```

## Release History

* 2020-03-05 v0.2.0 location/parse 方法返回结构变更
* 2018-11-20 v0.1.9 添加模块 util
* 2018-10-30 v0.1.2 添加 mvc 模块，修正部分代码使用了 es6 语法的问题
* 2018-10-26 v0.1.0 发布第一版
