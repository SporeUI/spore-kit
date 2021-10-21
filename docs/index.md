# @spore-ui/kit

原子化工具库

## 何时使用

虽然已经有了 underscore, lodash 这样优秀的工具库，但是日常开发中还是有很多常用的方法并未囊括在其中。

本工具库意图在日常业务积累中，留存各种常见工具函数，解决方案，Hack方案。

同时，也作为一个目录，整合线上一些优秀的工具库与工具函数，作为一批优秀工具库的索引，提供一些工具的快速使用封装。

工具函数进行了分门别类的梳理，推荐使用时引用确定版本，直接引用函数，可以直接减少代码打包体积。

## 快速上手

```shell
npm i spore-kit
```

```javascript
// 统一引入 spore-kit
var $kit = require('@spore-ui/kit');
console.info($kit.arr.contains); //function

// 单独引入 spore-kit/packages/arr
var $arr = require('@spore-ui/kit/packages/arr');
console.info($arr.contains); //function

// 单独引入一个方法（推荐）
var $contains = require('@spore-ui/kit/packages/arr/contains');
```

## 测试

- [测试覆盖率](https://sporeui.github.io/spore-kit/coverage/lcov-report/index.html)
