# 项目维护

## 维护流程

- 在 develop 分支提交代码
- 合并到 master 分支即可触发发布流程
- 发布流程会进行测试，文档生成，版本发布

## 文档构建

文档构建流程配置到了 github actions

- 执行 npm run doc 生成文档

## 代码测试与文档维护

- 执行 gulp 验证打包是否有异常
- 执行 npm test 测试代码
- 执行 npm run cover 生成覆盖率报告
