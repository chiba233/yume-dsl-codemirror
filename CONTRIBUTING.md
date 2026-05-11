**English** | [中文](./CONTRIBUTING.zh-CN.md)

# Contributing to yumeDSL

Thanks for your interest in contributing! This guide covers how to set up the package, run tests, and submit changes.

## Ecosystem

| Package                                                                      | Description                                                     |
|------------------------------------------------------------------------------|-----------------------------------------------------------------|
| [`yume-dsl-rich-text`](https://github.com/chiba233/yumeDSL)                  | Parser core — text to token tree                                |
| [`yume-dsl-token-walker`](https://github.com/chiba233/yume-dsl-token-walker) | Interpreter — token tree to output nodes                        |
| [`yume-dsl-shiki-highlight`](https://github.com/chiba233/yume-dsl-shiki-highlight) | Highlight layer — structural tree to colored tokens       |
| [`yume-dsl-markdown-it`](https://github.com/chiba233/yume-dsl-markdown-it)  | markdown-it plugin — DSL tags inside Markdown                   |
| **`yume-dsl-codemirror`**                                                    | CodeMirror 6 editor integration layer                           |

## Prerequisites

- **Node.js** >= 18
- **npm** or **pnpm**

## Getting started

```bash
git clone https://github.com/chiba233/yume-dsl-codemirror.git
cd yume-dsl-codemirror
npm install

# Build
npm run build

# Run tests
npm test
```

## Development workflow

1. Create a branch from `main`.
2. Make your changes.
3. Run `npm run lint` and `npm test`.
4. Commit with a clear message.
5. Open a pull request.

## Commit conventions

| Prefix      | Usage                                                   |
|-------------|---------------------------------------------------------|
| `feat:`     | New feature                                             |
| `fix:`      | Bug fix                                                 |
| `docs:`     | Documentation only                                      |
| `test:`     | Adding or updating tests                                |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `chore:`    | Build, CI, tooling changes                              |

## Code guidelines

- No `as any` assertions.
- Avoid `any`; prefer narrowed unions and type guards.
- Keep the package as CodeMirror glue, not a second parser configuration system.
- Reuse `yume-dsl-rich-text` syntax and tag-name configuration instead of inventing parallel options.

## Testing

- Tests live in `tests/`.
- When fixing a bug, add the smallest regression case.
- Do not change existing behavior tests without explaining why the old expectation was wrong.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
