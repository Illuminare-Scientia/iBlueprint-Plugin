# iBlueprint plugins

Plugins that connect AI assistants to [iBlueprint](https://iblueprint.ai), so you can run and edit your Blueprints, use your prompts and knowledge bases, plan projects, and chat with your agents without leaving the assistant.

| Plugin | What it does |
| --- | --- |
| [iblueprint](iblueprint/) | Find, run, debug, and edit Blueprints; use and save prompts; answer from knowledge bases; plan project goals and tasks; chat with agents |

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
