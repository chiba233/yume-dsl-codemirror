import type { Extension } from "@codemirror/state";
import { yumeChangeBridge } from "./change.js";
import { yumeCompletion } from "./completion.js";
import { yumeHighlight } from "./highlight.js";
import type { YumeDslOptions } from "./types.js";

export const yumeDsl = (options: YumeDslOptions): Extension[] => {
  const extensions: Extension[] = [];

  if (options.completion) {
    extensions.push(yumeCompletion(options.completion));
  }
  if (options.highlight) {
    extensions.push(yumeHighlight(options.highlight));
  }
  if (options.changeBridge) {
    extensions.push(yumeChangeBridge(options.changeBridge));
  }

  return extensions;
};
