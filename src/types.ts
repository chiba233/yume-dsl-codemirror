import type { Completion } from "@codemirror/autocomplete";
import type { Extension } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import type { IncrementalEdit, SyntaxConfig, SyntaxInput, TagNameConfig } from "yume-dsl-rich-text";

export interface HighlightTokenLike {
  content: string;
  color?: string;
  fontStyle?: string;
}

export interface TokenizerLike {
  tokenize(text: string): readonly HighlightTokenLike[];
}

export interface YumeHighlightOptions {
  tokenizer: TokenizerLike | ((text: string) => readonly HighlightTokenLike[]);
  /**
   * When true, only visible lines receive decorations.
   * Tokenization still sees the full document so multiline raw/block spans stay correct.
   *
   * @default true
   */
  viewportOnly?: boolean;
}

export interface YumeCompletionItem {
  label: string;
  detail?: string;
  info?: Completion["info"];
  type?: Completion["type"];
  boost?: number;
  /**
   * CodeMirror snippet template. When present, this takes precedence over `insertText`.
   */
  template?: string;
  /**
   * Plain insertion text used when no snippet template is provided.
   */
  insertText?: string;
  /**
   * Cursor offset relative to the start of `insertText`.
   * Defaults to the end of `insertText`.
   */
  cursorOffset?: number;
  apply?: Completion["apply"];
}

export interface YumeCompletionOptions {
  completions: readonly YumeCompletionItem[] | (() => readonly YumeCompletionItem[]);
  /**
   * Same syntax config shape accepted by yume-dsl-rich-text parser options.
   * Completion derives the tag-head trigger from `syntax.tagPrefix`.
   */
  syntax?: Partial<SyntaxInput> | SyntaxConfig;
  /**
   * Same tag-name config shape accepted by yume-dsl-rich-text parser options.
   * Completion uses it for both typed-prefix detection and `validFor`.
   */
  tagName?: Partial<TagNameConfig> | TagNameConfig;
  /**
   * Maximum number of characters to inspect before the cursor.
   *
   * @default 128
   */
  maxLookBehind?: number;
  /**
   * When true, a tag prefix immediately preceded by `syntax.escapeChar` does not trigger completion.
   *
   * @default true
   */
  ignoreEscapedPrefix?: boolean;
  activateOnTyping?: boolean;
}

export type ChangeSetLike = {
  iterChanges(
    callback: (
      fromA: number,
      toA: number,
      fromB: number,
      toB: number,
      inserted: { toString(): string },
    ) => void,
  ): void;
};

export type ChangeSetEditResult =
  | { kind: "single"; edit: IncrementalEdit }
  | { kind: "multi" }
  | { kind: "none" };

export interface YumeChangeBridgeOptions {
  onSingleEdit?: (edit: IncrementalEdit, newSource: string, view: EditorView) => void;
  onMultiEdit?: (newSource: string, view: EditorView) => void;
  onChange?: (result: ChangeSetEditResult, newSource: string, view: EditorView) => void;
}

export interface YumeDslOptions {
  highlight?: YumeHighlightOptions;
  completion?: YumeCompletionOptions;
  changeBridge?: YumeChangeBridgeOptions;
}

export interface YumeDslPreset {
  extensions: Extension[];
}
