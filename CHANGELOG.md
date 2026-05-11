**English** | [中文](./CHANGELOG.zh-CN.md)

# Changelog

### 0.1.0

- Initial package scaffold for CodeMirror 6 integration.
- Added `yumeHighlight(...)` for viewport-clipped decorations from yume-dsl highlight tokens.
- Added `yumeCompletion(...)` and `yumeCompletionSource(...)` for tag-head completions that reuse
  `yume-dsl-rich-text` syntax and tag-name configuration.
- Added `findYumeCompletionPrefix(...)` for completion-prefix detection, including custom `tagPrefix`,
  custom tag-name rules, and escaped-prefix suppression.
- Added `changeSetToIncrementalEdit(...)` and `yumeChangeBridge(...)` for bridging CodeMirror `ChangeSet`
  updates into `IncrementalEdit` payloads.
- Added `yumeDsl(...)` convenience preset for composing highlight, completion, and change bridge extensions.
