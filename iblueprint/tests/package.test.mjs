import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(pluginRoot, '..');

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(pluginRoot, relativePath), 'utf8'));
}

async function readRepositoryJson(relativePath) {
  return JSON.parse(await readFile(resolve(repositoryRoot, relativePath), 'utf8'));
}

describe('iBlueprint Claude directory file limits', () => {
  // The directory reads the plugin folder from GitHub and holds any version that exceeds these limits.
  const maxFiles = 512;
  const maxTextFileBytes = 256 * 1024;
  const imageAndFontExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ttf', '.otf', '.woff', '.woff2']);

  it('keeps tracked plugin files within the count and per-file size limits', async () => {
    const files = execFileSync('git', ['ls-files', '-z'], { cwd: pluginRoot, encoding: 'utf8' })
      .split('\0').filter(Boolean);

    assert.ok(files.includes('evals/mocks/iblueprint/_tools.json'));
    assert.ok(files.length <= maxFiles, `${files.length} files exceed ${maxFiles}`);
    for (const file of files) {
      if (imageAndFontExtensions.has(extname(file).toLowerCase())) continue;
      const { size } = await stat(resolve(pluginRoot, file));
      assert.ok(size < maxTextFileBytes, `${file} is ${size} bytes; keep it under ${maxTextFileBytes}`);
    }
  });
});

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

describe('iBlueprint Anthropic directory listing', () => {
  it('includes public documentation and the other directory listing URLs', async () => {
    const manifest = await readJson('.claude-plugin/plugin.json');

    assert.equal(manifest.documentationUrl, 'https://docs.iblueprint.ai/');
    for (const field of ['documentationUrl', 'supportUrl', 'privacyPolicyUrl', 'termsOfServiceUrl']) {
      const url = new URL(manifest[field]);
      assert.equal(url.protocol, 'https:');
      assert.equal(url.username, '');
      assert.equal(url.password, '');
    }
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

  it('advertises the Workforce surface and keeps host versions aligned', async () => {
    const manifest = await readJson('plugin.json');
    const claude = await readJson('.claude-plugin/plugin.json');
    const extension = await readRepositoryJson('gemini-extension.json');
    const skill = await readFile(resolve(pluginRoot, 'skills/iblueprint/SKILL.md'), 'utf8');
    const readme = await readFile(resolve(pluginRoot, 'README.md'), 'utf8');

    assert.equal(manifest.version, '0.2.0');
    assert.equal(claude.version, manifest.version);
    assert.equal(extension.version, manifest.version);
    assert.match(manifest.description, /Workforce/);
    assert.ok(manifest.keywords.includes('ai workforce'));
    assert.ok(manifest.extensions['com.openai'].interface.defaultPrompt.some((prompt) => /Workforce/.test(prompt)));
    for (const tool of ['workforce_get_my_capabilities', 'workforce_overview', 'workforce_list_employees']) {
      assert.match(skill, new RegExp(`\\b${tool}\\b`));
    }
    assert.match(skill, /AI Salary is AI operating cost/);
    assert.match(readme, /AI Workforce/);
  });

  it('keeps all Workforce MCP endpoints in the eval tool snapshot', async () => {
    const snapshot = await readJson('evals/mocks/iblueprint/_tools.json');
    const workforceTools = snapshot.tools.filter((tool) => tool.name.startsWith('workforce_'));

    assert.equal(workforceTools.length, 114);
    assert.ok(workforceTools.every((tool) => tool.inputSchema.type === 'object'));
    assert.ok(workforceTools.every((tool) => tool.securitySchemes?.[0]?.type === 'oauth2'));
    for (const name of ['workforce_get_my_capabilities', 'workforce_create_assignment', 'workforce_record_employee_feedback']) {
      assert.ok(workforceTools.some((tool) => tool.name === name), name);
    }
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

  it('includes submission metadata with a subtitle of at most 30 characters', async () => {
    const manifest = await readJson('plugin.json');
    const interfaceMetadata = manifest.extensions['com.openai'].interface;

    assert.ok(interfaceMetadata.shortDescription.length > 0);
    assert.ok(interfaceMetadata.shortDescription.length <= 30);
    for (const field of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
      const url = new URL(interfaceMetadata[field]);
      assert.equal(url.protocol, 'https:');
      assert.equal(url.hostname, 'iblueprint.ai');
      assert.equal(url.username, '');
      assert.equal(url.password, '');
    }
    assert.equal(interfaceMetadata.supportURL, 'https://iblueprint.ai/support');
    assert.equal(interfaceMetadata.privacyPolicyURL, 'https://iblueprint.ai/privacy');
    assert.equal(interfaceMetadata.termsOfServiceURL, 'https://iblueprint.ai/terms');
  });

  it('includes square PNG listing and composer icons within submission size limits', async () => {
    const manifest = await readJson('plugin.json');
    const interfaceMetadata = manifest.extensions['com.openai'].interface;

    for (const field of ['logo', 'composerIcon']) {
      assert.equal(interfaceMetadata[field], './assets/icon.png');
      const icon = await readFile(resolve(pluginRoot, interfaceMetadata[field]));
      assert.deepEqual(icon.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      assert.equal(icon.toString('ascii', 12, 16), 'IHDR');
      const width = icon.readUInt32BE(16);
      const height = icon.readUInt32BE(20);
      assert.equal(width, height);
      assert.ok(width >= 48 && width <= 4096);
      assert.ok(icon.length <= 5 * 1024 * 1024);
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
