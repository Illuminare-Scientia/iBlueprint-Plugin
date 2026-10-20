# iBlueprint

Find, run, debug, and edit your [iBlueprint](https://iblueprint.ai) Blueprints; use prompts and knowledge bases; plan projects; chat with agents; and manage your organization's authorized AI Workforce from Claude, ChatGPT, Codex, GitHub Copilot, or Gemini CLI. Workforce tools cover AI Employees, departments, onboarding and lifecycle, AI Salary, assignments, human questions, memory, communications, meetings, employee-authored tools, workstations, learning, delegation, and performance. All calls use the same account permissions and feature gates as the iBlueprint app.

## What you need

- An iBlueprint account. The plugin signs in to it in your browser and can see and do only what your account can in the app.
- AI connections and compute budget in iBlueprint for the Blueprints you run. Runs use them just as runs started in the app do.

## Connect

When the assistant first uses iBlueprint, complete your host's browser-based sign-in and consent prompt. In Claude Code, run `/mcp`, select `iblueprint`, and choose **Authenticate**. In Copilot CLI, use `/mcp`; in VS Code, use **MCP: List Servers**. In Gemini CLI, run `/mcp auth iblueprint`. In ChatGPT and Codex, use the plugin's connection prompt or connection settings. Never paste credentials into chat. To disconnect, go to **Settings → OAuth → Connected apps** in iBlueprint and select **Disconnect**.

## What it accesses

The plugin contains no code that runs on your machine. It has two parts:

- **Skills** (`skills/iblueprint`, `skills/setup`): instructions that tell the assistant to read current state, use ids returned by iBlueprint, and perform a run or write only when you ask. They also distinguish AI Salary operating cost from payroll and billing.
- **The iBlueprint MCP server** at `https://api.iblueprint.ai/api/mcp`. Every tool call goes there, authenticated as you. The tools can read the iBlueprint resources your account may access, including Workforce records, employee memory and conversations, salary and usage records, communication status, meetings, and workstation sessions. Write tools can run workflows; update Blueprints, prompts, projects, agents, and Workforce state; start or cancel assignments; answer questions; send approved communications; change lifecycle state; redact memory; control connected meetings or workstations; and revoke or roll back supported resources. The server enforces organization and employee authorization on every call. Connected agents and Workforce tools may act in external systems when the user requests it.

Nothing is sent anywhere other than iBlueprint. See the [privacy policy](https://iblueprint.ai/privacy), the [terms of service](https://iblueprint.ai/terms), and [support](https://iblueprint.ai/support).

## Install

**Claude:** add iBlueprint from the directory. In claude.ai and Cowork it's under **Customize → Plugins**; in Claude Code, run `/plugin directory`. You can also add only the connector under **Settings → Connectors → Add custom connector** with the URL `https://api.iblueprint.ai/api/mcp`. To install from this repository's marketplace instead, see the [repository installation instructions](../README.md#install).

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
| AI Workforce | `workforce_get_my_capabilities`, `workforce_overview`, and all focused `workforce_list_*` / `workforce_get_*` tools | Focused `workforce_*` actions for lifecycle, salary, assignments, questions, communications, meetings, tools, workstations, learning, delegation, and feedback |

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

The evals answer from mocked tools in `evals/mocks/`, so they need no iBlueprint account or network access. The validation, test, and eval commands are in the [repository README](../README.md#development-and-updates).

For Claude directory ZIP submissions, use the [runtime-only packaging command](../README.md#claude-directory-submission). It excludes development fixtures, including the large eval tool snapshot, while leaving them available in source for local evaluation.

## License

MIT. See [LICENSE](LICENSE).
