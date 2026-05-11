[English](./CHANGELOG.md) | **中文**

# 更新日志

### 0.1.0

- 首次搭建 CodeMirror 6 集成包。
- 新增 `yumeHighlight(...)`，基于 yume-dsl 高亮 token 生成裁剪到可视区域的 decorations。
- 新增 `yumeCompletion(...)` 与 `yumeCompletionSource(...)`，提供 tag-head 补全，并复用
  `yume-dsl-rich-text` 的 syntax 与 tag-name 配置。
- 新增 `findYumeCompletionPrefix(...)`，支持自定义 `tagPrefix`、自定义标签名字符规则，以及忽略被转义的前缀。
- 新增 `changeSetToIncrementalEdit(...)` 与 `yumeChangeBridge(...)`，将 CodeMirror `ChangeSet`
  变更桥接为 `IncrementalEdit` 载荷。
- 新增 `yumeDsl(...)` 组合入口，用于拼装高亮、补全和变更桥接 extension。
