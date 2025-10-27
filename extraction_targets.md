
# Extraction Targets

This document identifies the parts of the `claude-code` fork that are specific to Anthropic's infrastructure and should be bypassed or isolated when integrating "Seven".

## GitHub Actions Workflows

The following GitHub Actions workflows are specific to Anthropic's infrastructure and should be replaced with Seven's own CI/CD workflows:

*   `.github/workflows/auto-close-duplicates.yml`: This workflow is triggered by the `auto-close-duplicates.ts` script and is specific to Anthropic's issue management process.
*   `.github/workflows/backfill-duplicate-comments.yml`: This workflow is triggered by the `backfill-duplicate-comments.ts` script and is also specific to Anthropic's issue management process.
*   `.github/workflows/claude-dedupe-issues.yml`: This workflow is part of the duplicate issue detection and is specific to Anthropic's infrastructure.
*   `.github/workflows/claude-issue-triage.yml`: This workflow is for triaging issues and is specific to Anthropic's infrastructure.
*   `.github/workflows/claude.yml`: This is a general-purpose workflow that is likely specific to Anthropic's infrastructure.

## Scripts

The following scripts interact with the GitHub API and are specific to Anthropic's infrastructure. They should be replaced with Seven's own scripts for interacting with GitHub.

*   `scripts/auto-close-duplicates.ts`: This script automatically closes GitHub issues that are marked as duplicates.
*   `scripts/backfill-duplicate-comments.ts`: This script backfills duplicate comments on GitHub issues.

## Analytics and Reporting

The following files are related to analytics and reporting and are likely specific to Anthropic's infrastructure. They should be removed or replaced with Seven's own analytics and reporting mechanisms.

*   `/bug` command: The `README.md` mentions a `/bug` command for reporting issues. This is likely tied to Anthropic's internal bug tracking system and should be replaced.
*   Data collection and usage policies: The `README.md` mentions data collection and usage policies that are specific to Anthropic. These should be replaced with Seven's own policies.
