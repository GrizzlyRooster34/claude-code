/**
 * Markdown diff formatter for HEI-75
 * Produces human-readable diff with syntax highlighting
 */

import { DiffSummary } from "../models/diff-model";
import { formatUnifiedDiff } from "./unified-formatter";

/**
 * Format diff summary as markdown
 */
export function formatMarkdownDiff(summary: DiffSummary): string {
  let output = `## Changes Summary\n\n`;
  output += `- **Files changed:** ${summary.filesChanged}\n`;
  output += `- **Insertions:** +${summary.insertions}\n`;
  output += `- **Deletions:** -${summary.deletions}\n\n`;

  for (const file of summary.files) {
    output += formatFileSection(file, summary);
  }

  return output;
}

/**
 * Format a single file section in markdown
 */
function formatFileSection(file: any, summary: DiffSummary): string {
  let output = `### \`${file.filePath}\`\n\n`;

  // File type badge
  if (file.type === "create") {
    output += `**Status:** \`NEW FILE\`\n\n`;
  } else if (file.type === "delete") {
    output += `**Status:** \`DELETED\`\n\n`;
  } else if (file.type === "rename") {
    output += `**Status:** \`RENAMED\` from \`${file.oldPath}\`\n\n`;
  }

  // Diff content in code block
  output += "```diff\n";
  output += formatUnifiedDiff({ ...summary, files: [file] });
  output += "```\n\n";

  return output;
}
