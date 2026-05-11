export { yumeHighlight, buildYumeHighlightDecorations } from "./highlight.js";
export { yumeCompletion, yumeCompletionSource, findYumeCompletionPrefix } from "./completion.js";
export { yumeChangeBridge, changeSetToIncrementalEdit } from "./change.js";
export { yumeDsl } from "./preset.js";

export type {
  ChangeSetEditResult,
  ChangeSetLike,
  HighlightTokenLike,
  TokenizerLike,
  YumeChangeBridgeOptions,
  YumeCompletionItem,
  YumeCompletionOptions,
  YumeDslOptions,
  YumeDslPreset,
  YumeHighlightOptions,
} from "./types.js";
export type { YumeCompletionPrefix } from "./completion.js";
