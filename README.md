**English** | [中文](GUIDE.zh-CN.md)

# yume-dsl-codemirror

<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />

[![npm](https://img.shields.io/npm/v/yume-dsl-codemirror)](https://www.npmjs.com/package/yume-dsl-codemirror)
[![GitHub](https://img.shields.io/badge/GitHub-chiba233%2Fyume--dsl--codemirror-181717?logo=github)](https://github.com/chiba233/yume-dsl-codemirror)
[![CI](https://github.com/chiba233/yume-dsl-codemirror/actions/workflows/publish-yume-dsl-codemirror.yml/badge.svg)](https://github.com/chiba233/yume-dsl-codemirror/actions/workflows/publish-yume-dsl-codemirror.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Contributing](https://img.shields.io/badge/Contributing-guide-blue.svg)](./CONTRIBUTING.md)
[![Security](https://img.shields.io/badge/Security-policy-red.svg)](./SECURITY.md)

CodeMirror 6 integration layer for yumeDSL editing.

This package is intentionally small in `0.1.x`: it extracts the reusable editor glue that a yumeDSL app usually writes
by hand.

- `yumeHighlight(...)` — viewport decorations from a yumeDSL tokenizer
- `yumeCompletion(...)` — tag-head snippet/plain-text completions
- `changeSetToIncrementalEdit(...)` — convert CodeMirror changes to `IncrementalEdit`
- `yumeChangeBridge(...)` — update listener for incremental sessions
- `yumeDsl(...)` — convenience preset that composes the enabled pieces

## Ecosystem

```
text ──▶ yume-dsl-rich-text ──▶ StructuralNode[] / TextToken[]
  │                  │
  │                  ├── yume-dsl-shiki-highlight ──▶ HighlightToken[]
  │                  ├── yume-dsl-token-walker ─────▶ interpret / lint / slice
  │                  ╰── yume-dsl-codemirror ───────▶ CodeMirror extensions
```

| Package                                                                            | Role                                      |
|------------------------------------------------------------------------------------|-------------------------------------------|
| [`yume-dsl-rich-text`](https://github.com/chiba233/yumeDSL)                        | Parser — text to token tree               |
| [`yume-dsl-shiki-highlight`](https://github.com/chiba233/yume-dsl-shiki-highlight) | Syntax highlighting — tokens or grammar   |
| [`yume-dsl-token-walker`](https://github.com/chiba233/yume-dsl-token-walker)       | Operations — interpret, query, lint, slice |
| **`yume-dsl-codemirror`**                                                          | CodeMirror 6 editor integration layer     |

---

## Quick Navigation

**Start here:**
[Install](#install) · [Quick Start](#quick-start) · [Scope](#scope)

**API:**
[Highlight](#yumehighlightoptions) · [Completion](#yumecompletionoptions) · [Incremental edit bridge](#changesettoincrementaleditchanges)

**Reference:**
[Changelog](./CHANGELOG.md) · [Contributing](./CONTRIBUTING.md) · [Security](./SECURITY.md)

---

## Install

```bash
npm install yume-dsl-codemirror @codemirror/state @codemirror/view @codemirror/autocomplete
```

## Quick Start

```ts
import { createTokenizerFromParser } from "yume-dsl-shiki-highlight";
import { createIncrementalSession, createParser } from "yume-dsl-rich-text";
import { yumeDsl } from "yume-dsl-codemirror";

const parserOptions = {
  handlers,
  syntax,
};

const parser = createParser(parserOptions);
const tokenizer = createTokenizerFromParser(parserOptions);
const session = createIncrementalSession(initialSource, parserOptions);

const extensions = yumeDsl({
  highlight: { tokenizer },
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

// Pass `extensions` into your CodeMirror EditorState / EditorView setup.

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

`tokenizer` can be a `yume-dsl-shiki-highlight` tokenizer or a plain function:

```ts
type TokenizerLike = {
  tokenize(text: string): readonly { content: string; color?: string; fontStyle?: string }[];
};
```

The full document is tokenized so multiline raw/block spans stay correct, but decorations are clipped to the visible
viewport by default.

### `yumeCompletion(options)`

```ts
yumeCompletion({
  syntax,
  tagName,
  completions: [
    { label: "bold", template: "$$bold(${text})$$" },
    { label: "code", template: "$$code(${lang})%\n${content}\n%end$$" },
  ],
});
```

Completion follows the same parser protocol you pass to `yume-dsl-rich-text`: `syntax.tagPrefix` controls where a tag
head starts, `tagName` controls legal tag-name characters, and escaped prefixes are ignored by default. For the demo
syntax, pass the same `syntax` object that uses `tagPrefix: "="`.

### `changeSetToIncrementalEdit(changes)`

```ts
const result = changeSetToIncrementalEdit(update.changes);

if (result.kind === "single") {
  session.applyEditWithDiff(result.edit, update.state.doc.toString(), parserOptions);
} else {
  session.rebuild(update.state.doc.toString(), parserOptions);
}
```

Returns:

```ts
type ChangeSetEditResult =
  | { kind: "single"; edit: IncrementalEdit }
  | { kind: "multi" }
  | { kind: "none" };
```

## Scope

This is not a full IDE layer yet. Diagnostics, hover, folding, and LSP-style features are intentionally left for later
minor versions once the small editor core is stable.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE) &copy; 星野夢華
