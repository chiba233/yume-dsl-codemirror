import type { Range } from "@codemirror/state";
import { Decoration, ViewPlugin, type DecorationSet, type EditorView, type ViewUpdate } from "@codemirror/view";
import type { HighlightTokenLike, TokenizerLike, YumeHighlightOptions } from "./types.js";

interface HighlightPluginState {
  decorations: DecorationSet;
  update(update: ViewUpdate): void;
}

const getTokenizer = (
  tokenizer: TokenizerLike | ((text: string) => readonly HighlightTokenLike[]),
): ((text: string) => readonly HighlightTokenLike[]) =>
  typeof tokenizer === "function" ? tokenizer : (text) => tokenizer.tokenize(text);

const buildStyle = (token: HighlightTokenLike): string | undefined => {
  const styles: string[] = [];
  if (token.color) styles.push(`color: ${token.color}`);
  if (token.fontStyle) styles.push(`font-style: ${token.fontStyle}`);
  return styles.length > 0 ? styles.join("; ") : undefined;
};

export const buildYumeHighlightDecorations = (
  view: EditorView,
  options: YumeHighlightOptions,
): DecorationSet => {
  const text = view.state.doc.toString();
  const tokenize = getTokenizer(options.tokenizer);
  const tokens = tokenize(text);
  const viewportOnly = options.viewportOnly ?? true;
  const viewportFrom = viewportOnly ? view.state.doc.lineAt(view.viewport.from).from : 0;
  const viewportTo = viewportOnly ? view.state.doc.lineAt(view.viewport.to).to : text.length;
  const ranges: Array<Range<Decoration>> = [];
  let offset = 0;

  for (const token of tokens) {
    const length = token.content.length;
    const end = offset + length;
    if (offset >= viewportTo) break;

    const style = buildStyle(token);
    if (style && length > 0 && end > viewportFrom) {
      ranges.push(
        Decoration.mark({ attributes: { style } }).range(
          Math.max(offset, viewportFrom),
          Math.min(end, viewportTo),
        ),
      );
    }

    offset = end;
  }

  return Decoration.set(ranges, true);
};

export const yumeHighlight = (options: YumeHighlightOptions) =>
  ViewPlugin.define<HighlightPluginState>(
    (view) => {
      const state: HighlightPluginState = {
        decorations: buildYumeHighlightDecorations(view, options),
        update(update) {
          if (update.docChanged || update.viewportChanged) {
            state.decorations = buildYumeHighlightDecorations(update.view, options);
          }
        },
      };
      return state;
    },
    {
      decorations: (value) => value.decorations,
    },
  );
