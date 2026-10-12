# iBlueprint

Find, run, debug, and edit your [iBlueprint](https://iblueprint.ai) Blueprints, use and save prompts, answer questions from your knowledge bases, plan project goals and tasks, and chat with your agents, from Claude, ChatGPT, Codex, GitHub Copilot, or Gemini CLI. Ask for a Blueprint by name, and the assistant checks which inputs it needs, runs it, follows the run, and reports the result. It can also explain why a run failed, or design a change to a Blueprint and save it once you agree. It can fill in and use a prompt from your prompt library, save new prompts to it, and it can search or read the documents in your knowledge bases and answer with the sources it used. It can set goals in your projects, break them into tasks, keep those tasks up to date, and pass messages to your iBlueprint agents and relay their replies.

## What you need

- An iBlueprint account. The plugin signs in to it in your browser and can see and do only what your account can in the app.
- AI connections and compute budget in iBlueprint for the Blueprints you run. Runs use them just as runs started in the app do.

## Connect

When the assistant first uses iBlueprint, complete your host's browser-based sign-in and consent prompt. In Claude Code, run `/mcp`, select `iblueprint`, and choose **Authenticate**. In Copilot CLI, use `/mcp`; in VS Code, use **MCP: List Servers**. In Gemini CLI, run `/mcp auth iblueprint`. In ChatGPT and Codex, use the plugin's connection prompt or connection settings. Never paste credentials into chat. To disconnect, go to **Settings → OAuth → Connected apps** in iBlueprint and select **Disconnect**.

## What it accesses

The plugin contains no code that runs on your machine. It has two parts:

- **Skills** (`skills/iblueprint`, `skills/setup`): instructions that tell the assistant to run a Blueprint only when you ask, and only once. They also tell it to ask for missing inputs rather than invent them, and to show you an edit before saving it.
- **The iBlueprint MCP server** at `https://api.iblueprint.ai/api/mcp`. Every tool call goes there, authenticated as you. The tools read your organizations, Blueprints, prompts, projects, goals, tasks, agents and their conversations, tools, run history, and knowledge bases, including the text of their documents. They change something only when the assistant calls a write tool: `run_blueprint`, `apply_blueprint_operations`, `create_blueprint`, `create_prompt`, `update_prompt`, `create_project`, `create_goal`, `update_goal`, `create_task`, `update_task`, `add_task_note`, or `chat_with_agent`. An agent you message can act through its own tools, such as sending email. Nothing can be deleted through the plugin. Saved prompts are private unless you share them with an organization. Before an edit is saved, the current Blueprint is stored as a version you can restore.

Nothing is sent anywhere other than iBlueprint. See the [privacy policy](https://iblueprint.ai/privacy), the [terms of service](https://iblueprint.ai/terms), and [support](https://iblueprint.ai/support).

## Install

**Claude Code**

```bash
claude plugin marketplace add Illuminare-Scientia/iBlueprint-Plugin
claude plugin install iblueprint@iblueprint
```

**claude.ai and Cowork:** add iBlueprint from the directory, or add the connector yourself under **Settings → Connectors → Add custom connector** with the URL `https://api.iblueprint.ai/api/mcp`.

**OpenAI ChatGPT and Codex, GitHub Copilot, and Gemini CLI:** see the [repository installation instructions](../README.md#install) for marketplace registration, local installation, and host-specific authentication. Copilot shares this package's Agent Plugins manifest, MCP configuration, and skills. Gemini installs from the repository root and imports these skills as context.

## Tools

| Area | Read | Write |
| --- | --- | --- |
| Account | `get_profile`, `list_organizations` | |
| Blueprints | `list_blueprints`, `get_blueprint_inputs`, `get_blueprint`, `get_node`, `list_node_types`, `get_node_type`, `validate_operations`, and lookups of agents, tools, MCP servers, knowledge bases, and environment variables | `create_blueprint`, `apply_blueprint_operations` |
| Runs | `get_execution`, `list_executions` | `run_blueprint` |
| Prompts | `list_prompts`, `get_prompt` | `create_prompt`, `update_prompt` |
| Knowledge bases | `list_knowledge_bases`, `list_knowledge_base_documents`, `get_knowledge_base_document`, `search_knowledge_base` | |
| Projects | `list_projects`, `list_goals`, `list_tasks`, `get_task` | `create_project`, `create_goal`, `update_goal`, `create_task`, `update_task`, `add_task_note` |
| Agents | `list_agents`, `get_agent_conversation`, `list_agent_conversations` | `chat_with_agent` |

## Development

| Path | Used by |
| --- | --- |
| `.claude-plugin/plugin.json`, `.mcp.json` | Claude: Claude Code, claude.ai, and Cowork |
| `plugin.json` (Agent Plugins manifest), `mcp.json` | ChatGPT, Codex, and Copilot CLI/VS Code |
| `skills/` | Claude, OpenAI, and Copilot; imported as context by Gemini CLI |
| `../.agents/plugins/marketplace.json` | OpenAI marketplace catalog |
| `../.claude-plugin/marketplace.json` | Claude/Copilot marketplace catalog |
| `../gemini-extension.json`, `../GEMINI.md` | Gemini CLI extension and shared context imports |
| `evals/` | `claude plugin eval`; not loaded at run time |
| `tests/` | `node --test`, checks the portable package |

From the repository root:

```bash
claude plugin validate --strict iblueprint
node --test iblueprint/tests/package.test.mjs
claude plugin eval iblueprint --runs 1 --ablation none
```

The evals answer from mocked tools in `evals/mocks/`, so they need no iBlueprint account or network access.

## License

MIT. See [LICENSE](LICENSE).
