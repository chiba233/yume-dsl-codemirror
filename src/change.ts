import { EditorView } from "@codemirror/view";
import type { ChangeSetEditResult, ChangeSetLike, YumeChangeBridgeOptions } from "./types.js";

export const changeSetToIncrementalEdit = (changes: ChangeSetLike): ChangeSetEditResult => {
  let editCount = 0;
  let startOffset = 0;
  let oldEndOffset = 0;
  let newText = "";

  changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
    editCount++;
    if (editCount === 1) {
      startOffset = fromA;
      oldEndOffset = toA;
      newText = inserted.toString();
    }
  });

  if (editCount === 0) return { kind: "none" };
  if (editCount > 1) return { kind: "multi" };
  return {
    kind: "single",
    edit: {
      startOffset,
      oldEndOffset,
      newText,
    },
  };
};

export const yumeChangeBridge = (options: YumeChangeBridgeOptions) =>
  EditorView.updateListener.of((update) => {
    if (!update.docChanged) return;

    const newSource = update.state.doc.toString();
    const result = changeSetToIncrementalEdit(update.changes);
    options.onChange?.(result, newSource, update.view);

    if (result.kind === "single") {
      options.onSingleEdit?.(result.edit, newSource, update.view);
    } else if (result.kind === "multi") {
      options.onMultiEdit?.(newSource, update.view);
    }
  });
