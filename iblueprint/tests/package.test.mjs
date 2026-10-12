import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(pluginRoot, '..');

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(pluginRoot, relativePath), 'utf8'));
}

async function readRepositoryJson(relativePath) {
  return JSON.parse(await readFile(resolve(repositoryRoot, relativePath), 'utf8'));
}

describe('iBlueprint marketplaces', () => {
  it('resolves the Claude/Copilot entry to both packaged manifests', async () => {
    const marketplace = JSON.parse(
      await readFile(resolve(repositoryRoot, '.claude-plugin/marketplace.json'), 'utf8'),
    );
    const manifest = await readJson('.claude-plugin/plugin.json');
    const portable = await readJson('plugin.json');

    assert.equal(marketplace.name, 'iblueprint');
    assert.equal(marketplace.plugins.length, 1);
    const [plugin] = marketplace.plugins;
    assert.equal(plugin.name, manifest.name);
    assert.equal(plugin.name, portable.name);
    assert.equal(plugin.source, './iblueprint');
    assert.equal(resolve(repositoryRoot, plugin.source), pluginRoot);
  });

  it('resolves the OpenAI catalog from the repository root', async () => {
    const marketplace = await readRepositoryJson('.agents/plugins/marketplace.json');
    const manifest = await readJson('plugin.json');

    assert.equal(marketplace.name, 'iblueprint');
    assert.equal(marketplace.interface.displayName, 'iBlueprint');
    assert.equal(marketplace.plugins.length, 1);
    const [plugin] = marketplace.plugins;
    assert.equal(plugin.name, manifest.name);
    assert.deepEqual(plugin.source, { source: 'local', path: './iblueprint' });
    assert.equal(resolve(repositoryRoot, plugin.source.path), pluginRoot);
    assert.deepEqual(plugin.policy, {
      installation: 'AVAILABLE',
      authentication: 'ON_INSTALL',
    });
  });
});

describe('iBlueprint portable OpenAI and Copilot plugin package', () => {
  it('has portable metadata and an OpenAI onboarding skill', async () => {
    const manifest = await readJson('plugin.json');
    const openai = manifest.extensions['com.openai'];

    assert.equal(manifest.name, 'iblueprint');
    assert.equal(openai.onboardingSkill, './skills/setup/SKILL.md');
    assert.ok(openai.interface.defaultPrompt.length > 0);
    await readFile(resolve(pluginRoot, openai.onboardingSkill), 'utf8');
  });

  it('uses Copilot-supported portable discovery without host-specific executable components', async () => {
    const manifest = await readJson('plugin.json');

    assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
    for (const field of ['skills', 'mcpServers', 'hooks', 'agents', 'commands']) {
      assert.equal(Object.hasOwn(manifest, field), false);
    }
    for (const name of ['setup', 'iblueprint']) {
      const skill = await readFile(resolve(pluginRoot, 'skills', name, 'SKILL.md'), 'utf8');
      assert.match(skill, new RegExp(`^---\\r?\\nname: ${name}\\r?\\n`));
    }
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

  it('keeps Claude and portable MCP transports pointed at the same server', async () => {
    const claude = await readJson('.mcp.json');
    const portable = await readJson('mcp.json');

    assert.deepEqual(claude.mcpServers, {
      iblueprint: { type: 'http', url: portable.mcpServers.iblueprint.url },
    });
  });
});

describe('iBlueprint Gemini CLI extension', () => {
  it('uses Streamable HTTP with OAuth without bypassing tool confirmations', async () => {
    const extension = await readRepositoryJson('gemini-extension.json');
    const manifest = await readJson('plugin.json');
    const portable = await readJson('mcp.json');

    assert.equal(extension.name, manifest.name);
    assert.equal(extension.version, manifest.version);
    assert.deepEqual(extension.mcpServers, {
      iblueprint: {
        httpUrl: portable.mcpServers.iblueprint.url,
        oauth: { enabled: true },
      },
    });
  });

  it('loads the existing setup and workflow skills through relative context imports', async () => {
    const extension = await readRepositoryJson('gemini-extension.json');
    assert.equal(extension.contextFileName, 'GEMINI.md');
    const contextPath = resolve(repositoryRoot, extension.contextFileName);
    const context = await readFile(contextPath, 'utf8');
    const imports = [...context.matchAll(/^@(\.\/[^\r\n]+)$/gm)].map((match) => match[1]);

    assert.deepEqual(imports, [
      './iblueprint/skills/setup/SKILL.md',
      './iblueprint/skills/iblueprint/SKILL.md',
    ]);
    for (const relativePath of imports) {
      const skill = await readFile(resolve(dirname(contextPath), relativePath), 'utf8');
      assert.match(skill, /^---\r?\nname: /);
    }
    assert.match(context, /\/mcp auth iblueprint/);
  });
});
