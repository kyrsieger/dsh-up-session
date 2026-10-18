# dsh-up-session

一个 DSH（DeepSeek Harness）侧边栏插件：在「工作区」列表上方插入一个「置顶」区，把分散在各个工作区里的置顶会话汇总到一处显示。

## 项目结构

- `client.js`：插件的全部实现。以 `window.__ModuleLoader__.load` 工厂形式注册，向 `shell.overlay` 槽位注入置顶区，通过 `uiWorkspace` 读取置顶状态，并打开 / 取消置顶 / 归档会话。归档仍被宿主的“停止并归档”确认逻辑拦住时，插件自己渲染同一个确认框。
- `index.js`：Host 端占位。插件没有 Host 行为，该文件只用于满足 bundle 的 Host 行。
- `cordis.patch.yml`：bundle 补丁，向宿主插入 `dsh-up-session` 这一行。
- `locale/*.json`：插件市场展示用的标题与描述，不含运行时文案（运行时词典在 `client.js` 中）。

项目没有构建步骤，宿主直接加载上述文件；改完代码后重载插件或刷新页面即可看到效果。

## 文档参考

- [术语表](./GLOSSARY.md)：项目领域术语的定义，以及同一概念的用词取舍。
- [ADR 目录](./docs/adr/)：架构决策记录，说明难以逆转的设计决定及其背景。
