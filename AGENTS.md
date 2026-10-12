# Updating this repository

Reference a local checkout of the iBlueprint platform repository before updating this plugin. Its location varies by machine; ask for it if you don't know it.

- Its `plugins/` folder: upstream plugin package, marketplace manifest, skills, evaluation fixtures, and package tests. Compare its `iblueprint/` directory with this repository's `iblueprint/`, and its `.claude-plugin/marketplace.json` with this repository's marketplace manifest.
- The rest of the platform repository: implementation and documentation. Consult the relevant API and shared types when checking tool names, inputs, authentication, or behavior.

If the platform checkout is unavailable, report that limitation rather than assuming the plugin is current. Do not modify the platform repository as part of a plugin update unless explicitly requested.

Preserve repository-specific documentation, update guidance, ignore rules, and multi-host packaging when syncing upstream changes. This repository supports Claude, OpenAI (ChatGPT and Codex), GitHub Copilot (CLI and VS Code), and Gemini CLI. Keep the OpenAI marketplace at `.agents/plugins/marketplace.json`, the Claude/Copilot marketplace at `.claude-plugin/marketplace.json`, and the root Gemini extension and context imports intact even when the platform copy does not yet include them.

Reuse `iblueprint/skills/` across hosts instead of duplicating workflow instructions. Keep all MCP configurations pointed at the same remote endpoint, use each host's supported transport format, and preserve browser-based OAuth and tool-call confirmations. Do not copy credentials, local environment files, dependency directories, OS metadata, or generated evaluation results.

After updates, run `node --test iblueprint/tests/package.test.mjs`. When the Claude CLI is available, also run `claude plugin validate --strict .` and `claude plugin validate --strict iblueprint` from this repository's root.
