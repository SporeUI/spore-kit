# 发布流程

- 提交代码
- 修改 package.json 的 spore-kit 版本号
- 修改 README.md 添加更新说明
- 执行 lerna publish 发布子模块
- 执行 npm test 测试代码
- 执行 npm run cover 生成覆盖率报告
- 执行 npm run doc 生成文档
- 再次提交代码，将构件好的文档提交
- 执行 npm publish 发布组件
