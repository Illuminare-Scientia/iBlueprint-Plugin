import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(pluginRoot, relativePath), 'utf8'));
}

describe('iBlueprint portable OpenAI plugin package', () => {
  it('has portable metadata and an OpenAI onboarding skill', async () => {
    const manifest = await readJson('plugin.json');
    const openai = manifest.extensions['com.openai'];

    assert.equal(manifest.name, 'iblueprint');
    assert.equal(openai.onboardingSkill, './skills/setup/SKILL.md');
    assert.ok(openai.interface.defaultPrompt.length > 0);
  });

  it('connects exactly one remote Streamable HTTP MCP server', async () => {
    const mcp = await readJson('mcp.json');
    const servers = Object.entries(mcp.mcpServers);

    assert.equal(servers.length, 1);
    assert.equal(servers[0][0], 'iblueprint');
    assert.deepEqual(servers[0][1], {
      type: 'streamable-http',
      url: 'https://api.iblueprint.ai/api/mcp',
    });
  });
});
