import { execFileSync } from 'node:child_process';
import { copyFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  '.claude-plugin/marketplace.json',
  'LICENSE',
  'README.md',
  'iblueprint/.claude-plugin/plugin.json',
  'iblueprint/.mcp.json',
  'iblueprint/LICENSE',
  'iblueprint/README.md',
  'iblueprint/assets/icon.png',
  'iblueprint/skills/setup/SKILL.md',
  'iblueprint/skills/iblueprint/SKILL.md',
];

if (process.argv.length > 3) {
  throw new Error('Usage: node scripts/package-claude.mjs [output.zip]');
}

const outputPath = resolve(process.argv[2] ?? join(repositoryRoot, 'iblueprint-claude.zip'));
if (!outputPath.endsWith('.zip')) {
  throw new Error('The output path must end in .zip');
}

const temporaryDirectory = await mkdtemp(join(tmpdir(), 'iblueprint-claude-'));
try {
  const archivePath = join(temporaryDirectory, 'submission.zip');
  execFileSync('zip', ['-X', '-MM', archivePath, ...files], {
    cwd: repositoryRoot,
    stdio: 'pipe',
  });
  await copyFile(archivePath, outputPath);
  console.log(`Created Claude submission: ${outputPath}`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
