/**
 * Diff module exports for HEI-75
 * Provides unified diff computation and formatting
 */

// Core models
export {
  DiffLine,
  DiffHunk,
  FileDiff,
  DiffSummary,
  DiffModel,
} from "./models/diff-model";

// Computation
export { DiffComputer, DiffComputeOptions } from "./compute/diff-computer";

// Formatters
export { formatUnifiedDiff } from "./format/unified-formatter";
export { formatGitDiff } from "./format/git-formatter";
export { formatMarkdownDiff } from "./format/markdown-formatter";
