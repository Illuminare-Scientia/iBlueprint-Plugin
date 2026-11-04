# Credential review

Reviewed on November 4, 2026 against local commit `d7dbe3538380051a07bb17d535316797769544bd` (plugin version `0.2.1`). The `iblueprint/` directory on GitHub's `main` branch matched the local tree `49053795b190fd978ecdcb31471c88ea4e0540be` during inspection.

## Finding

No installer-credential reader was found in the submitted plugin configuration or skills. The plugin uses a remote MCP connection with browser-based OAuth. There is no credential-reading field in the reviewed `.claude-plugin/plugin.json` and no environment-derived authorization header in its MCP configuration.

This is a source review, not confirmation that the directory's safety hold has been cleared. Manifest validation does not run that safety scan. The reviewer must identify the scanned commit and the specific credential source and destination if the hold persists.

## Authentication and data flow

1. The host discovers `https://api.iblueprint.ai/api/mcp` from the MCP configuration.
2. The user signs in and approves access through the host's browser-based OAuth flow.
3. The host manages the resulting OAuth credentials and authenticates subsequent MCP requests. The plugin does not implement a token reader or supply a bearer header.
4. Requested tool arguments go to the iBlueprint MCP endpoint. Server-side workflows and connected tools can act in external systems under the user's authorization; this note does not claim that every downstream action remains inside iBlueprint.

| Reviewed file | Relevant behavior |
| --- | --- |
| [Marketplace](.claude-plugin/marketplace.json) | Selects `./iblueprint` as the submitted plugin. |
| [Claude manifest](iblueprint/.claude-plugin/plugin.json) | Metadata and listing URLs only. No inline MCP commands, hooks, credential helper, environment settings, or `userConfig`. |
| [Claude MCP configuration](iblueprint/.mcp.json) | One HTTP server with the fixed iBlueprint URL. No headers, environment variables, command, arguments, or header helper. |
| [Portable MCP configuration](iblueprint/mcp.json) | The same endpoint over Streamable HTTP; no credential header or local process. |
| [Setup skill](iblueprint/skills/setup/SKILL.md) | Directs the user to the host's normal sign-in and consent flow. Explicitly forbids requesting pasted credentials in chat. |
| [Workflow skill](iblueprint/skills/iblueprint/SKILL.md) | Uses authenticated MCP tools. Does not instruct the assistant to read local credentials. |
| [Gemini adapter](gemini-extension.json) | Repository-level adapter for the same remote endpoint with OAuth enabled. |

Claude documents its remote MCP OAuth support in [Authenticate with remote MCP servers](https://code.claude.com/docs/en/mcp#authenticate-with-remote-mcp-servers).

## Development files

The [failed-run mock](iblueprint/evals/explains-failed-run/mocks/iblueprint/get_node.md) describes a fictional Blueprint node with a named `Acme ERP service account` connection. It does not load an environment variable, read a credential file, make an HTTP request, or supply authentication for this plugin.

The [package tests](iblueprint/tests/package.test.mjs) read manifests, skills, and asset metadata and invoke `git ls-files` to inspect the submitted file list. They do not retrieve installer credentials or send network requests. These development files are visible to the repository review. No cause for the credential-reading finding was established by this inspection.

## Reviewer response

> The reviewed plugin uses host-managed browser OAuth for its single remote MCP endpoint, `https://api.iblueprint.ai/api/mcp`. Its Claude manifest contains metadata only, and its MCP configuration has no credential header, environment interpolation, or local executable. Please identify the scanned commit and the exact source field or code line for the credential-reading finding so we can address any remaining issue.

Do not add an API-key prompt or `${user_config.KEY}` merely to satisfy this warning: the reviewed plugin has no installer credential reference to replace. If a future feature deliberately accepts a user-provided key, its collection, destination, and purpose must be explicit and separately reviewed.
