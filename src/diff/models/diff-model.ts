/**
 * Core diff model interfaces and classes for HEI-75
 * Provides unified representation of file diffs for Edit/Write/Bash tools
 */

export interface DiffLine {
  lineNumber: number;
  type: "added" | "removed" | "context" | "unchanged";
  content: string;
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface FileDiff {
  filePath: string;
  oldPath?: string; // For renames
  type: "modify" | "create" | "delete" | "rename";
  hunks: DiffHunk[];
}

export interface DiffSummary {
  filesChanged: number;
  insertions: number;
  deletions: number;
  files: FileDiff[];
}

/**
 * Main diff model class providing unified access to diff data
 */
export class DiffModel {
  private summary: DiffSummary;

  constructor(summary: DiffSummary) {
    this.summary = summary;
  }

  getSummary(): DiffSummary {
    return this.summary;
  }

  getFile(filePath: string): FileDiff | undefined {
    return this.summary.files.find((f) => f.filePath === filePath);
  }

  getTotalChanges(): { insertions: number; deletions: number } {
    return {
      insertions: this.summary.insertions,
      deletions: this.summary.deletions,
    };
  }

  /**
   * Formats diff as unified diff (standard patch format)
   */
  toUnifiedDiffString(): string {
    return this.formatUnifiedDiff(this.summary);
  }

  /**
   * Formats diff as git diff (with git metadata)
   */
  toGitDiffString(): string {
    return this.formatGitDiff(this.summary);
  }

  /**
   * Formats diff as markdown (human-readable with syntax highlighting)
   */
  toMarkdownDiffString(): string {
    return this.formatMarkdownDiff(this.summary);
  }

  // Internal formatters (imported from format/ directory)
  private formatUnifiedDiff(summary: DiffSummary): string {
    return summary.files.map((file) => this.formatFileDiff(file)).join("\n\n");
  }

  private formatFileDiff(file: FileDiff): string {
    let output = `--- ${file.oldPath || file.filePath}\n`;
    output += `+++ ${file.filePath}\n`;

    for (const hunk of file.hunks) {
      output += this.formatHunk(hunk);
    }

    return output;
  }

  private formatHunk(hunk: DiffHunk): string {
    let output = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@\n`;

    for (const line of hunk.lines) {
      const prefix =
        line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
      output += `${prefix}${line.content}\n`;
    }

    return output;
  }

  private formatGitDiff(summary: DiffSummary): string {
    let output = "";

    for (const file of summary.files) {
      output += `diff --git a/${file.filePath} b/${file.filePath}\n`;

      if (file.type === "create") {
        output += `new file mode 100644\n`;
      } else if (file.type === "delete") {
        output += `deleted file mode 100644\n`;
      }

      output += this.formatUnifiedDiff({ ...summary, files: [file] });
    }

    return output;
  }

  private formatMarkdownDiff(summary: DiffSummary): string {
    let output = `## Changes Summary\n\n`;
    output += `- **Files changed:** ${summary.filesChanged}\n`;
    output += `- **Insertions:** +${summary.insertions}\n`;
    output += `- **Deletions:** -${summary.deletions}\n\n`;

    for (const file of summary.files) {
      output += `### \`${file.filePath}\`\n\n`;
      output += "```diff\n";
      output += this.formatUnifiedDiff({ ...summary, files: [file] });
      output += "```\n\n";
    }

    return output;
  }
}
