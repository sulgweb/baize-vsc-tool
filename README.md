# baize-vsc-tool

**baize-vsc-tool** 是一个 VSCode 插件，能够通过获取 Git commit 记录并结合 AI（Dify API）生成工作总结，帮助开发者更好地理解项目的进展和工作成果。

## 特性

- 集成 Dify API，用于生成 Git commit 总结。
- 简化开发工作流程，自动汇总和分析 Git 提交记录。

## 配置

在使用前，你需要在 VSCode 设置中配置插件的一些选项，例如 API Key 和 Dify API 基础 URL。

### 1. 配置项

在 VSCode 设置中，你可以找到以下配置项：

- **baize.apiKey**
  - 类型：`string`
  - 默认值：`""`
  - 描述：用于 Dify 集成的 API Key。
- **baize.difyUrl**
  - 类型：`string`
  - 默认值：`"https://api.dify.ai/v1"`
  - 描述：Dify API 的基础 URL。

## 使用

### 1. 打开命令面板

按 `Ctrl+Shift+P` 打开命令面板，然后输入并选择 `baize:git summarize`，插件将自动生成 Git commit 的工作总结。

### 2. 工作总结

插件会通过 Dify API 分析当前项目的 Git commit 记录，并生成简洁的工作总结，帮助你快速了解项目的进展。