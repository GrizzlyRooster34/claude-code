/**
 * Git diff formatter for HEI-75
 * Produces git-compatible diff format with metadata
 */

import { DiffSummary } from "../models/diff-model";
import { formatUnifiedDiff } from "./unified-formatter";

/**
 * Format diff summary as git diff
 */
export function formatGitDiff(summary: DiffSummary): string {
  let output = "";

  for (const file of summary.files) {
    output += `diff --git a/${file.filePath} b/${file.filePath}\n`;

    if (file.type === "create") {
      output += `new file mode 100644\n`;
    } else if (file.type === "delete") {
      output += `deleted file mode 100644\n`;
    } else if (file.type === "rename" && file.oldPath) {
      output += `rename from ${file.oldPath}\n`;
      output += `rename to ${file.filePath}\n`;
    }

    // Include unified diff for the file
    output += formatUnifiedDiff({ ...summary, files: [file] });
    output += "\n";
  }

  return output;
}
