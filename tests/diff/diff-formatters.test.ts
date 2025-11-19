/**
 * Unit tests for diff formatters (HEI-75)
 */

import { DiffModel, DiffSummary } from "../../src/diff/models/diff-model";
import { formatUnifiedDiff } from "../../src/diff/format/unified-formatter";
import { formatGitDiff } from "../../src/diff/format/git-formatter";
import { formatMarkdownDiff } from "../../src/diff/format/markdown-formatter";

describe("Diff Formatters", () => {
  const mockSummary: DiffSummary = {
    filesChanged: 1,
    insertions: 1,
    deletions: 1,
    files: [
      {
        filePath: "test.ts",
        type: "modify",
        hunks: [
          {
            oldStart: 1,
            oldLines: 3,
            newStart: 1,
            newLines: 3,
            lines: [
              { lineNumber: 1, type: "unchanged", content: "line1" },
              { lineNumber: 2, type: "removed", content: "old line" },
              { lineNumber: 2, type: "added", content: "new line" },
              { lineNumber: 3, type: "unchanged", content: "line3" },
            ],
          },
        ],
      },
    ],
  };

  describe("formatUnifiedDiff", () => {
    it("should format as unified diff", () => {
      const output = formatUnifiedDiff(mockSummary);

      expect(output).toContain("--- test.ts");
      expect(output).toContain("+++ test.ts");
      expect(output).toContain("@@");
      expect(output).toContain("-old line");
      expect(output).toContain("+new line");
      expect(output).toContain(" line1");
      expect(output).toContain(" line3");
    });

    it("should handle multiple files", () => {
      const multiFileSummary: DiffSummary = {
        ...mockSummary,
        filesChanged: 2,
        files: [
          mockSummary.files[0],
          {
            filePath: "test2.ts",
            type: "create",
            hunks: [
              {
                oldStart: 0,
                oldLines: 0,
                newStart: 1,
                newLines: 1,
                lines: [{ lineNumber: 1, type: "added", content: "new file" }],
              },
            ],
          },
        ],
      };

      const output = formatUnifiedDiff(multiFileSummary);

      expect(output).toContain("test.ts");
      expect(output).toContain("test2.ts");
    });
  });

  describe("formatGitDiff", () => {
    it("should format as git diff", () => {
      const output = formatGitDiff(mockSummary);

      expect(output).toContain("diff --git a/test.ts b/test.ts");
      expect(output).toContain("--- test.ts");
      expect(output).toContain("+++ test.ts");
    });

    it("should include file mode for new files", () => {
      const createSummary: DiffSummary = {
        ...mockSummary,
        files: [
          {
            ...mockSummary.files[0],
            type: "create",
          },
        ],
      };

      const output = formatGitDiff(createSummary);

      expect(output).toContain("new file mode 100644");
    });

    it("should include file mode for deleted files", () => {
      const deleteSummary: DiffSummary = {
        ...mockSummary,
        files: [
          {
            ...mockSummary.files[0],
            type: "delete",
          },
        ],
      };

      const output = formatGitDiff(deleteSummary);

      expect(output).toContain("deleted file mode 100644");
    });

    it("should handle renamed files", () => {
      const renameSummary: DiffSummary = {
        ...mockSummary,
        files: [
          {
            ...mockSummary.files[0],
            type: "rename",
            oldPath: "old-test.ts",
            filePath: "new-test.ts",
          },
        ],
      };

      const output = formatGitDiff(renameSummary);

      expect(output).toContain("rename from old-test.ts");
      expect(output).toContain("rename to new-test.ts");
    });
  });

  describe("formatMarkdownDiff", () => {
    it("should format as markdown", () => {
      const output = formatMarkdownDiff(mockSummary);

      expect(output).toContain("## Changes Summary");
      expect(output).toContain("**Files changed:** 1");
      expect(output).toContain("**Insertions:** +1");
      expect(output).toContain("**Deletions:** -1");
      expect(output).toContain("### `test.ts`");
      expect(output).toContain("```diff");
      expect(output).toContain("```");
    });

    it("should show file status badges", () => {
      const createSummary: DiffSummary = {
        ...mockSummary,
        files: [
          {
            ...mockSummary.files[0],
            type: "create",
          },
        ],
      };

      const output = formatMarkdownDiff(createSummary);

      expect(output).toContain("**Status:** `NEW FILE`");
    });

    it("should show deleted status", () => {
      const deleteSummary: DiffSummary = {
        ...mockSummary,
        files: [
          {
            ...mockSummary.files[0],
            type: "delete",
          },
        ],
      };

      const output = formatMarkdownDiff(deleteSummary);

      expect(output).toContain("**Status:** `DELETED`");
    });

    it("should show renamed status", () => {
      const renameSummary: DiffSummary = {
        ...mockSummary,
        files: [
          {
            ...mockSummary.files[0],
            type: "rename",
            oldPath: "old.ts",
          },
        ],
      };

      const output = formatMarkdownDiff(renameSummary);

      expect(output).toContain("**Status:** `RENAMED`");
      expect(output).toContain("old.ts");
    });
  });

  describe("DiffModel formatting methods", () => {
    it("should provide all three format methods", () => {
      const model = new DiffModel(mockSummary);

      const unified = model.toUnifiedDiffString();
      const git = model.toGitDiffString();
      const markdown = model.toMarkdownDiffString();

      expect(unified).toContain("---");
      expect(git).toContain("diff --git");
      expect(markdown).toContain("## Changes Summary");
    });
  });
});
