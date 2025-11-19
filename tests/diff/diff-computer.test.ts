/**
 * Unit tests for DiffComputer (HEI-75)
 */

import { DiffComputer } from "../../src/diff/compute/diff-computer";

describe("DiffComputer", () => {
  let computer: DiffComputer;

  beforeEach(() => {
    computer = new DiffComputer({ contextLines: 3 });
  });

  describe("computeFileDiff", () => {
    it("should compute diff for single line change", () => {
      const oldContent = "function foo() {\n  return 1;\n}";
      const newContent = "function foo() {\n  return 2;\n}";

      const diff = computer.computeFileDiff("test.ts", oldContent, newContent);

      expect(diff.filePath).toBe("test.ts");
      expect(diff.type).toBe("modify");
      expect(diff.hunks.length).toBeGreaterThan(0);
      expect(diff.hunks[0].lines.some((l) => l.type === "removed")).toBe(true);
      expect(diff.hunks[0].lines.some((l) => l.type === "added")).toBe(true);
    });

    it("should detect file creation", () => {
      const oldContent = "";
      const newContent = "console.log('hello');";

      const diff = computer.computeFileDiff("new.ts", oldContent, newContent);

      expect(diff.type).toBe("create");
    });

    it("should detect file deletion", () => {
      const oldContent = "console.log('hello');";
      const newContent = "";

      const diff = computer.computeFileDiff("deleted.ts", oldContent, newContent);

      expect(diff.type).toBe("delete");
    });

    it("should handle multiline changes", () => {
      const oldContent = "line1\nline2\nline3\nline4";
      const newContent = "line1\nmodified2\nmodified3\nline4";

      const diff = computer.computeFileDiff("test.ts", oldContent, newContent);

      expect(diff.type).toBe("modify");
      expect(diff.hunks.length).toBeGreaterThan(0);
    });

    it("should handle no changes", () => {
      const content = "unchanged content\nline 2";

      const diff = computer.computeFileDiff("test.ts", content, content);

      expect(diff.type).toBe("modify");
      expect(diff.hunks[0].lines.every((l) => l.type === "unchanged")).toBe(true);
    });
  });

  describe("computeMultiFileDiff", () => {
    it("should compute diff for multiple files", () => {
      const changes = [
        {
          path: "file1.ts",
          oldContent: "old1",
          newContent: "new1",
        },
        {
          path: "file2.ts",
          oldContent: "old2\nold3",
          newContent: "new2\nnew3",
        },
      ];

      const diffModel = computer.computeMultiFileDiff(changes);
      const summary = diffModel.getSummary();

      expect(summary.filesChanged).toBe(2);
      expect(summary.files.length).toBe(2);
      expect(summary.insertions).toBeGreaterThan(0);
      expect(summary.deletions).toBeGreaterThan(0);
    });

    it("should count insertions and deletions correctly", () => {
      const changes = [
        {
          path: "test.ts",
          oldContent: "line1\nline2",
          newContent: "line1\nmodified2\nline3",
        },
      ];

      const diffModel = computer.computeMultiFileDiff(changes);
      const summary = diffModel.getSummary();

      expect(summary.insertions).toBeGreaterThanOrEqual(1);
      expect(summary.deletions).toBeGreaterThanOrEqual(1);
    });
  });

  describe("options", () => {
    it("should respect contextLines option", () => {
      const computerWithContext = new DiffComputer({ contextLines: 1 });
      const oldContent = "line1\nline2\nline3\nline4\nline5";
      const newContent = "line1\nmodified\nline3\nline4\nline5";

      const diff = computerWithContext.computeFileDiff("test.ts", oldContent, newContent);

      expect(diff.hunks.length).toBeGreaterThan(0);
      // Context should limit surrounding lines
    });

    it("should handle ignoreWhitespace option", () => {
      const computerIgnoreWs = new DiffComputer({ ignoreWhitespace: true });
      const oldContent = "line1\n  line2";
      const newContent = "line1\nline2"; // No leading spaces

      const diff = computerIgnoreWs.computeFileDiff("test.ts", oldContent, newContent);

      // With ignoreWhitespace, should detect fewer changes
      expect(diff.type).toBe("modify");
    });
  });

  describe("edge cases", () => {
    it("should handle empty files", () => {
      const diff = computer.computeFileDiff("empty.ts", "", "");

      expect(diff.type).toBe("modify");
      expect(diff.hunks.length).toBeGreaterThan(0);
    });

    it("should handle files with only whitespace", () => {
      const oldContent = "   \n\n  ";
      const newContent = "content";

      const diff = computer.computeFileDiff("test.ts", oldContent, newContent);

      expect(diff.type).toBe("modify");
    });

    it("should handle very long lines", () => {
      const longLine = "a".repeat(10000);
      const oldContent = longLine;
      const newContent = longLine + "b";

      const diff = computer.computeFileDiff("test.ts", oldContent, newContent);

      expect(diff.type).toBe("modify");
    });
  });
});
