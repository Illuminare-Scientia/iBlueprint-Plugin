---
name: setup
description: Connect an iBlueprint account and confirm which organization the plugin may use. Use immediately after installing iBlueprint or whenever its MCP tools report an authentication error.
---

# Set up iBlueprint

The iBlueprint MCP server acts only as the signed-in iBlueprint user. Never ask the user to paste an access token, password, API key, or other secret into chat.

1. Call the authenticated `list_organizations` tool.
2. If it returns an authorization error, direct the user to complete the host's normal iBlueprint sign-in and consent flow, then retry `list_organizations` once.
3. Report the organizations returned and identify the current organization. If the user has more than one organization and their next request is organization-specific, ask which one to use rather than guessing.
4. Confirm that read-only discovery works with `list_blueprints` before offering a run or edit.

Do not run a Blueprint, modify one, or request additional privileges during setup.
