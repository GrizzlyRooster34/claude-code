/**
 * Unified diff formatter for HEI-75
 * Produces standard unified diff format (patch-compatible)
 */

import { DiffSummary, FileDiff, DiffHunk } from "../models/diff-model";

/**
 * Format diff summary as unified diff
 */
export function formatUnifiedDiff(summary: DiffSummary): string {
  return summary.files.map((file) => formatFileDiff(file)).join("\n\n");
}

/**
 * Format a single file diff
 */
function formatFileDiff(file: FileDiff): string {
  let output = `--- ${file.oldPath || file.filePath}\n`;
  output += `+++ ${file.filePath}\n`;

  for (const hunk of file.hunks) {
    output += formatHunk(hunk);
  }

  return output;
}

/**
 * Format a single hunk
 */
function formatHunk(hunk: DiffHunk): string {
  let output = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@\n`;

  for (const line of hunk.lines) {
    const prefix =
      line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
    output += `${prefix}${line.content}\n`;
  }

  return output;
}
