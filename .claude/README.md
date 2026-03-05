# Superpowers Skill

This directory contains the [obra/superpowers](https://github.com/obra/superpowers) skill library installed for Claude Code.

## What is Superpowers?

Superpowers is a complete software development workflow for coding agents, built on top of a set of composable "skills" and initial instructions that ensure agents use them effectively.

## Installation

This skill was installed by copying the necessary files from the obra/superpowers repository:
- **skills/** - 14 core skills (TDD, debugging, collaboration patterns, etc.)
- **commands/** - Slash commands (/brainstorm, /write-plan, /execute-plan)
- **agents/** - Agent definitions (code-reviewer)
- **hooks/** - Lifecycle hooks for skill activation
- **skill.json** - Skill metadata and configuration

## Core Skills Included

### Testing
- **test-driven-development** - RED-GREEN-REFACTOR cycle with anti-patterns reference

### Debugging
- **systematic-debugging** - 4-phase root cause process
- **verification-before-completion** - Ensure fixes are verified

### Collaboration
- **brainstorming** - Socratic design refinement (use before any creative work)
- **writing-plans** - Detailed implementation plans
- **executing-plans** - Batch execution with checkpoints
- **dispatching-parallel-agents** - Concurrent subagent workflows
- **requesting-code-review** - Pre-review checklist
- **receiving-code-review** - Responding to feedback
- **using-git-worktrees** - Parallel development branches
- **finishing-a-development-branch** - Merge/PR decision workflow
- **subagent-driven-development** - Fast iteration with two-stage review

### Meta
- **writing-skills** - Create new skills following best practices
- **using-superpowers** - Introduction to the skills system

## How It Works

The skills activate automatically when relevant tasks are detected:
1. **brainstorming** - Activates before any creative work or feature development
2. **writing-plans** - Activates after design approval to create implementation plans
3. **test-driven-development** - Activates during implementation to enforce TDD
4. **requesting-code-review** - Activates between tasks for quality checks
5. And more...

## Available Commands

- `/brainstorm` - Start the brainstorming skill explicitly
- `/write-plan` - Create an implementation plan
- `/execute-plan` - Execute a plan step by step

## Philosophy

- **Test-Driven Development** - Write tests first, always
- **Systematic over ad-hoc** - Process over guessing
- **Complexity reduction** - Simplicity as primary goal
- **Evidence over claims** - Verify before declaring success

## Version

Current version: **4.3.1**

## License

MIT License - see [obra/superpowers](https://github.com/obra/superpowers) for details

## Credits

Created by Jesse Vincent (jesse@fsck.com)
Repository: https://github.com/obra/superpowers
