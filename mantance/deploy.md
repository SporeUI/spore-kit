# 项目维护

## 发布流程

- 提交代码
- 修改组件对应模块的文档 README.md
- 执行 gulp 验证打包是否有异常
- 执行 npx lerna publish 发布子模块
- 修改 package.json 的 spore-kit 版本号
- 修改 README.md 添加更新说明
- 再次提交代码，将构建好的文档提交
- 执行 npm publish 发布组件

## 文档构建

文档构建流程配置到了 github actions

- 执行 npm run doc 生成文档

## 代码测试与文档维护

- 执行 gulp 验证打包是否有异常
- 执行 npm test 测试代码
- 执行 npm run cover 生成覆盖率报告
