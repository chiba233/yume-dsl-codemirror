[English](README.md) | **中文**

# yume-dsl-codemirror

<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />

[![npm](https://img.shields.io/npm/v/yume-dsl-codemirror)](https://www.npmjs.com/package/yume-dsl-codemirror)
[![GitHub](https://img.shields.io/badge/GitHub-chiba233%2Fyume--dsl--codemirror-181717?logo=github)](https://github.com/chiba233/yume-dsl-codemirror)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Contributing](https://img.shields.io/badge/贡献指南-guide-blue.svg)](./CONTRIBUTING.zh-CN.md)
[![Security](https://img.shields.io/badge/安全策略-policy-red.svg)](./SECURITY.md)

CodeMirror 6 的 yumeDSL 编辑器集成层。

`0.1.x` 会刻意保持小而稳：只抽出 yumeDSL 应用通常会手写的编辑器胶水。

- `yumeHighlight(...)` —— 从 yumeDSL tokenizer 生成可视区域 decorations
- `yumeCompletion(...)` —— tag-head snippet / 纯文本补全
- `changeSetToIncrementalEdit(...)` —— 将 CodeMirror 变更转成 `IncrementalEdit`
- `yumeChangeBridge(...)` —— 用于增量 session 的 update listener
- `yumeDsl(...)` —— 组合入口，按需拼装上面的 extension

## 生态

```
text ──▶ yume-dsl-rich-text ──▶ StructuralNode[] / TextToken[]
  │                  │
  │                  ├── yume-dsl-shiki-highlight ──▶ HighlightToken[]
  │                  ├── yume-dsl-token-walker ─────▶ interpret / lint / slice
  │                  ╰── yume-dsl-codemirror ───────▶ CodeMirror extensions
```

| 包                                                                                  | 角色                     |
|------------------------------------------------------------------------------------|------------------------|
| [`yume-dsl-rich-text`](https://github.com/chiba233/yumeDSL)                        | 解析器 — 文本到 token 树      |
| [`yume-dsl-shiki-highlight`](https://github.com/chiba233/yume-dsl-shiki-highlight) | 语法高亮 — token / grammar |
| [`yume-dsl-token-walker`](https://github.com/chiba233/yume-dsl-token-walker)       | 操作层 — 解释、查询、lint、切片    |
| **`yume-dsl-codemirror`**                                                          | CodeMirror 6 编辑器集成层    |

## 安装

```bash
npm install yume-dsl-codemirror @codemirror/state @codemirror/view @codemirror/autocomplete
```

## 快速开始

```ts
import {createTokenizerFromParser} from "yume-dsl-shiki-highlight";
import {createIncrementalSession, createParser} from "yume-dsl-rich-text";
import {yumeDsl} from "yume-dsl-codemirror";

const parserOptions = {
    handlers,
    syntax,
};

const parser = createParser(parserOptions);
const tokenizer = createTokenizerFromParser(parserOptions);
const session = createIncrementalSession(initialSource, parserOptions);

const extensions = yumeDsl({
    highlight: {tokenizer},
    completion: {
        syntax,
        completions: [
            {
                label: "bold",
                detail: "inline",
                template: "$$bold(${text})$$",
            },
        ],
    },
    changeBridge: {
        onSingleEdit: (edit, newSource) => {
            session.applyEditWithDiff(edit, newSource, parserOptions);
        },
        onMultiEdit: (newSource) => {
            session.rebuild(newSource, parserOptions);
        },
    },
});

// 将 extensions 传给你的 CodeMirror EditorState / EditorView。

parser.parse(initialSource);
```

## API

### `yumeHighlight(options)`

```ts
yumeHighlight({
    tokenizer,
    viewportOnly: true,
});
```

`tokenizer` 可以是 `yume-dsl-shiki-highlight` tokenizer，也可以是普通函数：

```ts
type TokenizerLike = {
    tokenize(text: string): readonly { content: string; color?: string; fontStyle?: string }[];
};
```

默认会用完整文档做 tokenization，保证跨行 raw / block 高亮正确；实际 decorations 裁剪到可视区域。

### `yumeCompletion(options)`

```ts
yumeCompletion({
    syntax,
    tagName,
    completions: [
        {label: "bold", template: "$$bold(${text})$$"},
        {label: "code", template: "$$code(${lang})%\n${content}\n%end$$"},
    ],
});
```

补全复用你传给 `yume-dsl-rich-text` 的同一套协议：`syntax.tagPrefix` 控制 tag head 起点，
`tagName` 控制合法标签名字符；被 `syntax.escapeChar` 转义的前缀默认不会触发补全。

### `changeSetToIncrementalEdit(changes)`

```ts
const result = changeSetToIncrementalEdit(update.changes);

if (result.kind === "single") {
    session.applyEditWithDiff(result.edit, update.state.doc.toString(), parserOptions);
} else {
    session.rebuild(update.state.doc.toString(), parserOptions);
}
```

返回：

```ts
type ChangeSetEditResult =
    | { kind: "single"; edit: IncrementalEdit }
    | { kind: "multi" }
    | { kind: "none" };
```

## 边界

这还不是完整 IDE 层。Diagnostics、hover、folding、LSP 风格功能会等小核心稳定后再进入后续小版本。
