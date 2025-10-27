
# Injection Points

This document identifies the best places to inject the "Seven" code into the `claude-code` fork.

## Plugin Commands

The following files define the commands for the plugins. These are the main entry points for the plugins and are ideal places to inject code that integrates Seven into the workflows.

*   `plugins/feature-dev/commands/feature-dev.md`: This file defines the `/feature-dev` command, which is the main entry point for the feature development workflow. This would be a good place to inject code that integrates Seven into the workflow.
*   `plugins/code-review/commands/code-review.md`: This file defines the `/code-review` command. This would be a good place to inject code that uses Seven to perform code reviews.
*   `plugins/commit-commands/commands/commit.md`: This file defines the `/commit` command. This would be a good place to inject code that uses Seven to generate commit messages.

## Core CLI

While the plan is to keep new modules modular and not touch the core CLI, if we need to intercept all commands, the following files would be the places to look:

*   `src/cli/handlers/run.ts`: This is a hypothetical file path based on the project structure. It's likely that there is a central file that handles the execution of all commands. This would be a critical injection point to route all commands through Seven.
*   `src/plugins/index.ts`: This is another hypothetical file path. It's likely that there is a file that loads all the plugins. This would be a good place to inject code that registers Seven as a plugin or intercepts the loading of other plugins.
