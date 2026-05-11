import assert from "node:assert/strict";
import { createSyntax, createTagNameConfig } from "yume-dsl-rich-text";
import { changeSetToIncrementalEdit, findYumeCompletionPrefix } from "../src/index.ts";
import type { ChangeSetLike } from "../src/index.ts";

const fakeChangeSet = (
  changes: Array<[number, number, number, number, string]>,
): ChangeSetLike => ({
  iterChanges(callback) {
    for (const change of changes) {
      callback(change[0], change[1], change[2], change[3], {
        toString: () => change[4],
      });
    }
  },
});

{
  const result = changeSetToIncrementalEdit(fakeChangeSet([[3, 5, 3, 8, "hello"]]));
  assert.deepEqual(result, {
    kind: "single",
    edit: {
      startOffset: 3,
      oldEndOffset: 5,
      newText: "hello",
    },
  });
}

{
  assert.deepEqual(changeSetToIncrementalEdit(fakeChangeSet([])), { kind: "none" });
  assert.deepEqual(
    changeSetToIncrementalEdit(
      fakeChangeSet([
        [1, 1, 1, 2, "a"],
        [5, 6, 6, 6, ""],
      ]),
    ),
    { kind: "multi" },
  );
}

{
  assert.deepEqual(findYumeCompletionPrefix("hello $$bo", 10), {
    from: 6,
    typed: "bo",
  });
  assert.deepEqual(findYumeCompletionPrefix("hello =wa", 9, {
    syntax: createSyntax({ tagPrefix: "=" }),
  }), {
    from: 6,
    typed: "wa",
  });
  assert.deepEqual(findYumeCompletionPrefix("hello @@12", 10, {
    syntax: createSyntax({ tagPrefix: "@@" }),
    tagName: createTagNameConfig({
      isTagStartChar: (char) => /[A-Za-z0-9]/.test(char),
    }),
  }), {
    from: 6,
    typed: "12",
  });
  assert.equal(findYumeCompletionPrefix(String.raw`hello \$$bo`, 11), null);
  assert.equal(findYumeCompletionPrefix("hello $$bo!", 11), null);
}

console.log("PASS yume-dsl-codemirror tests");
