import { autocompletion, snippetCompletion, type Completion, type CompletionContext } from "@codemirror/autocomplete";
import type { EditorView } from "@codemirror/view";
import { createSyntax, createTagNameConfig, type SyntaxConfig, type TagNameConfig } from "yume-dsl-rich-text";
import type { YumeCompletionItem, YumeCompletionOptions } from "./types.js";

export interface YumeCompletionPrefix {
  from: number;
  typed: string;
}

interface ResolvedCompletionProtocol {
  syntax: SyntaxConfig;
  tagName: TagNameConfig;
  ignoreEscapedPrefix: boolean;
}

const resolveCompletionProtocol = (options: YumeCompletionOptions): ResolvedCompletionProtocol => ({
  syntax: createSyntax(options.syntax),
  tagName: createTagNameConfig(options.tagName),
  ignoreEscapedPrefix: options.ignoreEscapedPrefix ?? true,
});

const isEscapedPrefix = (
  textBeforeCursor: string,
  prefixStart: number,
  syntax: SyntaxConfig,
): boolean =>
  syntax.escapeChar.length > 0 &&
  prefixStart >= syntax.escapeChar.length &&
  textBeforeCursor.slice(prefixStart - syntax.escapeChar.length, prefixStart) === syntax.escapeChar;

const isValidTypedTagPrefix = (typed: string, tagName: TagNameConfig): boolean => {
  if (typed.length === 0) return true;
  const [first, ...rest] = Array.from(typed);
  if (!first || !tagName.isTagStartChar(first)) return false;
  for (const char of rest) {
    if (!tagName.isTagChar(char)) return false;
  }
  return true;
};

export const findYumeCompletionPrefix = (
  textBeforeCursor: string,
  absoluteCursor: number,
  protocol: Partial<ResolvedCompletionProtocol> = {},
): YumeCompletionPrefix | null => {
  const syntax = protocol.syntax ?? createSyntax();
  const tagName = protocol.tagName ?? createTagNameConfig();
  const ignoreEscapedPrefix = protocol.ignoreEscapedPrefix ?? true;
  const trigger = syntax.tagPrefix;

  for (let index = textBeforeCursor.length - trigger.length; index >= 0; index--) {
    if (!textBeforeCursor.startsWith(trigger, index)) continue;
    const typed = textBeforeCursor.slice(index + trigger.length);
    if (ignoreEscapedPrefix && isEscapedPrefix(textBeforeCursor, index, syntax)) return null;
    if (!isValidTypedTagPrefix(typed, tagName)) return null;
    return {
      from: absoluteCursor - typed.length - trigger.length,
      typed,
    };
  }

  return null;
};

const applyPlainText = (
  view: EditorView,
  item: YumeCompletionItem,
  from: number,
  to: number,
) => {
  const insert = item.insertText ?? item.label;
  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + (item.cursorOffset ?? insert.length) },
  });
};

const toCompletion = (item: YumeCompletionItem): Completion => {
  if (item.template) {
    return snippetCompletion(item.template, {
      label: item.label,
      detail: item.detail,
      info: item.info,
      type: item.type,
      boost: item.boost,
    });
  }

  return {
    label: item.label,
    detail: item.detail,
    info: item.info,
    type: item.type,
    boost: item.boost,
    apply: item.apply ?? ((view, _completion, from, to) => applyPlainText(view, item, from, to)),
  };
};

const resolveCompletions = (
  completions: YumeCompletionOptions["completions"],
): readonly YumeCompletionItem[] =>
  typeof completions === "function" ? completions() : completions;

export const yumeCompletionSource = (options: YumeCompletionOptions) => {
  const protocol = resolveCompletionProtocol(options);
  const maxLookBehind = options.maxLookBehind ?? 128;

  return (context: CompletionContext) => {
    const head = context.pos;
    const before = context.state.sliceDoc(Math.max(0, head - maxLookBehind), head);
    const prefix = findYumeCompletionPrefix(before, head, protocol);
    if (!prefix) return null;
    if (!context.explicit && prefix.typed.length === 0) return null;

    const optionsList = resolveCompletions(options.completions)
      .filter((item) => item.label.startsWith(prefix.typed))
      .map(toCompletion);

    if (optionsList.length === 0) return null;

    return {
      from: prefix.from,
      options: optionsList,
      validFor: (text: string) =>
        text.startsWith(protocol.syntax.tagPrefix) &&
        isValidTypedTagPrefix(text.slice(protocol.syntax.tagPrefix.length), protocol.tagName),
    };
  };
};

export const yumeCompletion = (options: YumeCompletionOptions) =>
  autocompletion({
    override: [yumeCompletionSource(options)],
    activateOnTyping: options.activateOnTyping ?? true,
    defaultKeymap: true,
  });
