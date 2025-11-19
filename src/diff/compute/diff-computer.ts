/**
 * Diff computation engine for HEI-75
 * Computes diffs between file contents using line-based comparison
 */

import {
  DiffModel,
  DiffSummary,
  FileDiff,
  DiffHunk,
  DiffLine,
} from "../models/diff-model";

export interface DiffComputeOptions {
  contextLines?: number; // Default: 3
  ignoreWhitespace?: boolean;
  algorithm?: "myers" | "patience" | "minimal";
}

/**
 * Computes diffs between file contents
 */
export class DiffComputer {
  private options: DiffComputeOptions;

  constructor(options: DiffComputeOptions = {}) {
    this.options = {
      contextLines: options.contextLines ?? 3,
      ignoreWhitespace: options.ignoreWhitespace ?? false,
      algorithm: options.algorithm ?? "myers",
    };
  }

  /**
   * Compute diff for a single file
   */
  computeFileDiff(
    filePath: string,
    oldContent: string,
    newContent: string
  ): FileDiff {
    const oldLines = oldContent.split("\n");
    const newLines = newContent.split("\n");

    const hunks = this.buildHunks(oldLines, newLines);
    const type = this.detectChangeType(oldContent, newContent);

    return {
      filePath,
      type,
      hunks,
    };
  }

  /**
   * Compute diffs for multiple files
   */
  computeMultiFileDiff(
    changes: Array<{ path: string; oldContent: string; newContent: string }>
  ): DiffModel {
    const files = changes.map((change) =>
      this.computeFileDiff(change.path, change.oldContent, change.newContent)
    );

    const summary: DiffSummary = {
      filesChanged: files.length,
      insertions: files.reduce((sum, f) => sum + this.countInsertions(f), 0),
      deletions: files.reduce((sum, f) => sum + this.countDeletions(f), 0),
      files,
    };

    return new DiffModel(summary);
  }

  /**
   * Build hunks from old/new line arrays using simple LCS
   */
  private buildHunks(oldLines: string[], newLines: string[]): DiffHunk[] {
    const hunks: DiffHunk[] = [];
    const changes = this.computeLineChanges(oldLines, newLines);

    // Group consecutive changes into hunks with context
    let currentHunk: DiffLine[] = [];
    let oldStart = 0;
    let newStart = 0;
    let contextBefore: DiffLine[] = [];

    for (let i = 0; i < changes.length; i++) {
      const change = changes[i];

      if (change.type === "unchanged") {
        // Add context lines
        if (currentHunk.length === 0) {
          // Context before changes
          contextBefore.push(change);
          if (contextBefore.length > this.options.contextLines!) {
            contextBefore.shift();
            oldStart++;
            newStart++;
          }
        } else {
          // Context after changes (check if we should close hunk)
          currentHunk.push(change);
          if (currentHunk.filter((l) => l.type === "unchanged").length > this.options.contextLines! * 2) {
            // Close current hunk
            const hunk = this.finalizeHunk(
              currentHunk.slice(0, -this.options.contextLines!),
              oldStart,
              newStart
            );
            hunks.push(hunk);

            // Reset for next hunk
            currentHunk = [];
            contextBefore = change.type === "unchanged" ? [change] : [];
            oldStart = change.lineNumber;
            newStart = change.lineNumber;
          }
        }
      } else {
        // Changed line - add context if starting new hunk
        if (currentHunk.length === 0 && contextBefore.length > 0) {
          currentHunk.push(...contextBefore);
          oldStart = contextBefore[0].lineNumber;
          newStart = contextBefore[0].lineNumber;
        }
        currentHunk.push(change);
      }
    }

    // Finalize last hunk if exists
    if (currentHunk.length > 0) {
      const hunk = this.finalizeHunk(currentHunk, oldStart, newStart);
      hunks.push(hunk);
    }

    return hunks.length > 0 ? hunks : [this.createDefaultHunk(oldLines, newLines)];
  }

  /**
   * Finalize hunk with proper line counts
   */
  private finalizeHunk(
    lines: DiffLine[],
    oldStart: number,
    newStart: number
  ): DiffHunk {
    const oldLines = lines.filter((l) => l.type !== "added").length;
    const newLines = lines.filter((l) => l.type !== "removed").length;

    return {
      oldStart: oldStart + 1, // 1-indexed
      oldLines,
      newStart: newStart + 1, // 1-indexed
      newLines,
      lines,
    };
  }

  /**
   * Create a default hunk when no changes detected (whole file)
   */
  private createDefaultHunk(oldLines: string[], newLines: string[]): DiffHunk {
    const lines: DiffLine[] = newLines.map((content, i) => ({
      lineNumber: i + 1,
      type: "unchanged" as const,
      content,
    }));

    return {
      oldStart: 1,
      oldLines: oldLines.length,
      newStart: 1,
      newLines: newLines.length,
      lines,
    };
  }

  /**
   * Compute line-by-line changes using simple diff algorithm
   */
  private computeLineChanges(
    oldLines: string[],
    newLines: string[]
  ): DiffLine[] {
    const changes: DiffLine[] = [];
    const lcs = this.longestCommonSubsequence(oldLines, newLines);

    let oldIdx = 0;
    let newIdx = 0;
    let lcsIdx = 0;

    while (oldIdx < oldLines.length || newIdx < newLines.length) {
      if (lcsIdx < lcs.length && oldLines[oldIdx] === lcs[lcsIdx] && newLines[newIdx] === lcs[lcsIdx]) {
        // Unchanged line
        changes.push({
          lineNumber: oldIdx + 1,
          type: "unchanged",
          content: oldLines[oldIdx],
        });
        oldIdx++;
        newIdx++;
        lcsIdx++;
      } else if (oldIdx < oldLines.length && (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx])) {
        // Removed line
        changes.push({
          lineNumber: oldIdx + 1,
          type: "removed",
          content: oldLines[oldIdx],
        });
        oldIdx++;
      } else if (newIdx < newLines.length && (lcsIdx >= lcs.length || newLines[newIdx] !== lcs[lcsIdx])) {
        // Added line
        changes.push({
          lineNumber: newIdx + 1,
          type: "added",
          content: newLines[newIdx],
        });
        newIdx++;
      }
    }

    return changes;
  }

  /**
   * Compute longest common subsequence for line matching
   */
  private longestCommonSubsequence(a: string[], b: string[]): string[] {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (this.linesEqual(a[i - 1], b[j - 1])) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to find LCS
    const lcs: string[] = [];
    let i = m;
    let j = n;

    while (i > 0 && j > 0) {
      if (this.linesEqual(a[i - 1], b[j - 1])) {
        lcs.unshift(a[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return lcs;
  }

  /**
   * Compare two lines for equality (with optional whitespace ignore)
   */
  private linesEqual(a: string, b: string): boolean {
    if (this.options.ignoreWhitespace) {
      return a.trim() === b.trim();
    }
    return a === b;
  }

  /**
   * Detect change type based on content
   */
  private detectChangeType(
    oldContent: string,
    newContent: string
  ): "modify" | "create" | "delete" {
    if (!oldContent && newContent) return "create";
    if (oldContent && !newContent) return "delete";
    return "modify";
  }

  /**
   * Count insertions in a file diff
   */
  private countInsertions(file: FileDiff): number {
    return file.hunks.reduce(
      (sum, hunk) => sum + hunk.lines.filter((l) => l.type === "added").length,
      0
    );
  }

  /**
   * Count deletions in a file diff
   */
  private countDeletions(file: FileDiff): number {
    return file.hunks.reduce(
      (sum, hunk) => sum + hunk.lines.filter((l) => l.type === "removed").length,
      0
    );
  }
}
