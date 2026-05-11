[English](./CONTRIBUTING.md) | **中文**

# 贡献指南

感谢你愿意参与 yumeDSL！这份文档说明如何搭建环境、运行测试和提交变更。

## 生态

| 包                                                                            | 角色                         |
|------------------------------------------------------------------------------|----------------------------|
| [`yume-dsl-rich-text`](https://github.com/chiba233/yumeDSL)                  | 解析核心 — 文本到 token 树       |
| [`yume-dsl-token-walker`](https://github.com/chiba233/yume-dsl-token-walker) | 解释层 — token 树到输出节点       |
| [`yume-dsl-shiki-highlight`](https://github.com/chiba233/yume-dsl-shiki-highlight) | 高亮层 — 结构树到彩色 token |
| [`yume-dsl-markdown-it`](https://github.com/chiba233/yume-dsl-markdown-it)   | markdown-it 插件             |
| **`yume-dsl-codemirror`**                                                    | CodeMirror 6 编辑器集成层       |

## 环境要求

- **Node.js** >= 18
- **npm** 或 **pnpm**

## 开始开发

```bash
git clone https://github.com/chiba233/yume-dsl-codemirror.git
cd yume-dsl-codemirror
npm install

# 构建
npm run build

# 测试
npm test
```

## 开发流程

1. 从 `main` 拉出分支。
2. 修改代码。
3. 运行 `npm run lint` 和 `npm test`。
4. 使用清晰的提交信息提交。
5. 打开 Pull Request。

## 提交前缀

| 前缀          | 用途                       |
|-------------|--------------------------|
| `feat:`     | 新功能                      |
| `fix:`      | 修复问题                     |
| `docs:`     | 纯文档修改                    |
| `test:`     | 新增或更新测试                  |
| `refactor:` | 不修 bug、不加功能的代码整理         |
| `chore:`    | 构建、CI、工具链变更              |

## 代码约束

- 不使用 `as any`。
- 尽量避免 `any`，优先使用联合类型收窄和类型守卫。
- 这个包应该保持为 CodeMirror 胶水层，不另造一套 parser 配置系统。
- 复用 `yume-dsl-rich-text` 的 syntax 和 tag-name 配置，不发明平行选项。

## 测试

- 测试放在 `tests/` 目录。
- 修 bug 时补最小回归用例。
- 如果要改已有测试期望，需要解释旧期望为什么不再正确。

## 许可证

提交贡献即表示你同意贡献内容按 [MIT License](./LICENSE) 授权。
