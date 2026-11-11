# dsh-up-session

一个 DSH（DeepSeek Harness）侧边栏插件：在「工作区」列表顶部插入「置顶」和「最近」两个分组，把分散在各个工作区里的置顶会话汇总到一处显示，也把最近的会话收拢到一处。

## 文档参考

- [术语表](./GLOSSARY.md)：项目领域术语的定义，以及同一概念的用词取舍。
- [文档目录](./docs/)：功能设计、行为规则及其他项目文档。
- [ADR 目录](./docs/adr/)：架构决策记录，说明难以逆转的设计决定及其背景。

## README 多语言

中文 [README.md](./README.md) 是默认版本，英文版本为 [README.en.md](./README.en.md)。修改 README 时必须同步修改其他语言版本，保持各版本内容一致（语言切换行、截图等结构也需对齐）。

## 兼容版本

修改 `package.json` 中的 `engines.dsh` 兼容版本时，必须同步修改中文 README「安装与兼容」和英文 README「Installation and compatibility」章节第一行的版本号，保持一致。

## CHANGELOG 和 Release 草稿

生成 CHANGELOG 和 Release 草稿时，如果某项功能或修复来自 GitHub PR，或解决了 GitHub issue，必须在对应条目中附上相关 PR 或 issue 的链接；两者都有时应同时附上。
