# iBlueprint plugins

Plugins that connect AI assistants to [iBlueprint](https://iblueprint.ai), so you can run and edit Blueprints, use prompts and knowledge bases, plan projects, chat with agents, and manage your authorized AI Workforce without leaving the assistant.

| Plugin | What it does |
| --- | --- |
| [iblueprint](iblueprint/) | Run and edit Blueprints; use prompts and knowledge bases; plan projects; chat with agents; manage AI Employees, assignments, AI Salary, communications, meetings, workstations, learning, and performance |

## Supported hosts

| Host | Package and installation |
| --- | --- |
| Claude Code, claude.ai, Cowork | Claude plugin and remote MCP connector |
| OpenAI ChatGPT and Codex | Agent Plugins package and OpenAI marketplace catalog |
| GitHub Copilot CLI and VS Code | Shared Agent Plugins package, skills, and MCP server |
| Gemini CLI | Gemini extension with OAuth and shared workflow context |

Gemini support targets **Gemini CLI**, not the Gemini web app. OpenAI support uses the current skills/MCP plugin format, not legacy ChatGPT `ai-plugin.json` plugins. Availability depends on the host version, account, and organization policies; packaging here does not imply publication in a public directory.

## Install

### Claude Code

```bash
claude plugin marketplace add Illuminare-Scientia/iBlueprint-Plugin
claude plugin install iblueprint@iblueprint
```

On claude.ai and in Cowork, add iBlueprint from the directory. The [plugin's README](iblueprint/README.md) covers signing in, what the plugin can access, and the full list of tools.

Anthropic directory listing metadata lives in [the Claude plugin manifest](iblueprint/.claude-plugin/plugin.json), including `documentationUrl` pointing to [the public iBlueprint documentation](https://docs.iblueprint.ai/). Keep these fields in the plugin manifest, not the marketplace entry.

#### Claude directory submission

The [Claude developer portal](https://claude.ai/directory/manage) reads the `iblueprint/` folder from this repository's `main` branch and scans each pushed commit; there is no ZIP upload. Every file in that folder counts, including `evals/` and `tests/`.

The directory holds a version for human review when any non-image, non-font file is 256 KiB or larger, or when the plugin has more than 512 files. The package test enforces both limits. The largest file is the eval tool snapshot, `evals/mocks/iblueprint/_tools.json`, so it is stored as compact JSON without indentation. Regenerate it the same way.

The PNG icon is already in its declared format. The portable `plugin.json` and other hosts' adapters are intentional; the portal only notes that Claude ignores them. Browser-based OAuth remains unchanged; the plugin has no install hooks, script downloads, or local credential-reading code.

For release `0.2.1`, the Claude, portable, and Gemini manifests share the same version. Increment all three for each release so existing Claude Code marketplace installs receive the update.

Before pushing a submission, run the package tests and strict validation below. On Claude Code 2.1.306 or later, also run the directory profile on a clean checkout:

```bash
claude plugin validate --profile directory --strict iblueprint
```

The validator scans local files, including ignored `.DS_Store` files and generated eval results; GitHub submissions contain only committed files. Keep local artifacts ignored and out of the submitted tree. Directory-profile validation does not run the portal's safety scan or policy review. Check the new commit's report in the developer portal after pushing; a local pass does not guarantee publication or clear a human-review hold.

### OpenAI ChatGPT and Codex

The [OpenAI marketplace catalog](.agents/plugins/marketplace.json) points to the shared [Agent Plugins package](iblueprint/plugin.json).

For Codex CLI, register this repository, then open `/plugins` to install iBlueprint and start a new session:

```bash
codex plugin marketplace add Illuminare-Scientia/iBlueprint-Plugin
```

For local testing, run `codex plugin marketplace add .` from this repository's root. In supported ChatGPT desktop workflows, select the repository marketplace in the Plugins Directory and install iBlueprint. Workspace admins can import the GitHub marketplace for team distribution. Follow the plugin's connection prompt to sign in to iBlueprint. The Codex IDE extension does not currently install plugins.

For an OpenAI submission ZIP, include only `plugin.json`, `mcp.json`, `skills/`, `assets/`, `LICENSE`, and `README.md` from `iblueprint/`. Put those files at the archive root, not inside an `iblueprint/` wrapper directory. Exclude OS metadata, evals, tests, marketplace catalogs, and other hosts' configuration. The OpenAI interface metadata must include a subtitle of at most 30 characters, accessible support/privacy/terms URLs, and bundled listing and composer icons. Upload the ZIP at [OpenAI Plugins](https://platform.openai.com/plugins) and complete the MCP connection and review checks.

### GitHub Copilot

Install from this repository's root with Copilot CLI:

```bash
copilot plugin install ./iblueprint
```

Or install the published repository's plugin subdirectory:

```bash
copilot plugin install Illuminare-Scientia/iBlueprint-Plugin:iblueprint
```

Open `/mcp` to connect the `iblueprint` server. Current VS Code versions discover plugins installed by Copilot CLI. Enable `chat.plugins.enabled` if needed, then use **MCP: List Servers** to connect iBlueprint and review the available skills. A separate Copilot manifest is unnecessary: Copilot reads the portable skills and MCP configuration and ignores OpenAI-specific metadata.

### Gemini CLI

Install the extension from this repository's root:

```bash
gemini extensions install .
```

Or install from GitHub:

```bash
gemini extensions install https://github.com/Illuminare-Scientia/iBlueprint-Plugin
```

Restart Gemini CLI, then run `/extensions list` and `/mcp auth iblueprint`. The root [extension manifest](gemini-extension.json) configures Streamable HTTP and OAuth. [GEMINI.md](GEMINI.md) imports the same setup and workflow instructions used by the other hosts, without maintaining separate copies. These are loaded as Gemini context rather than discovered as root-level Gemini skills.

### Host documentation

- [OpenAI plugin packaging and marketplaces](https://developers.openai.com/plugins/build/plugins)
- [Copilot CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
- [VS Code agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins)
- [Gemini CLI extensions](https://geminicli.com/docs/extensions/reference/) and [MCP authentication](https://geminicli.com/docs/tools/mcp-server/)

## Development and updates

This repository publishes the plugin maintained alongside the iBlueprint platform, whose `plugins/` folder holds the upstream copy.

Compare the upstream `plugins/iblueprint/` package and `plugins/.claude-plugin/marketplace.json` with their counterparts here. Preserve this repository's update guidance, ignore rules, and multi-host adapters described in [AGENTS.md](AGENTS.md), and exclude local artifacts and generated evaluation results.

From this repository's root, run:

```bash
node --test iblueprint/tests/package.test.mjs
```

When the Claude CLI is installed, also validate the marketplace and plugin:

```bash
claude plugin validate --strict .
claude plugin validate --strict iblueprint
claude plugin eval iblueprint --runs 1 --ablation none   # mocked tools; needs no iBlueprint account
```

See [AGENTS.md](AGENTS.md) for update guidance and the [plugin's development notes](iblueprint/README.md#development) for the package layout.

## Support

[iblueprint.ai/support](https://iblueprint.ai/support) · [Privacy policy](https://iblueprint.ai/privacy) · [Terms of service](https://iblueprint.ai/terms)

## License

MIT. See [LICENSE](LICENSE).
