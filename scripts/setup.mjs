#!/usr/bin/env node
/**
 * One-time / fresh-clone project setup.
 * Run: pnpm bootstrap
 */
import { copyFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

function run(command, args, { optional = false } = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0 && !optional) {
    process.exit(result.status ?? 1);
  }

  return result.status === 0;
}

function hasCommand(command) {
  const check =
    process.platform === 'win32'
      ? spawnSync('where', [command], { stdio: 'ignore' })
      : spawnSync('which', [command], { stdio: 'ignore' });

  return check.status === 0;
}

console.log('Setting up nextjs-cursor-boilerplate...\n');

if (!existsSync('.env') && existsSync('.env.example')) {
  copyFileSync('.env.example', '.env');
  console.log('Created .env from .env.example\n');
}

console.log('Generating Prisma client...');
run('pnpm', ['exec', 'prisma', 'generate']);

console.log('\nApplying database migrations...');
const migrated = run('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], {
  optional: true,
});

if (!migrated) {
  console.log('Migration deploy skipped — falling back to db push...');
  run('pnpm', ['exec', 'prisma', 'db', 'push'], { optional: true });
}

if (hasCommand('husky')) {
  console.log('\nInstalling Husky git hooks...');
  run('pnpm', ['exec', 'husky'], { optional: true });
}

if (hasCommand('graphify')) {
  console.log('\nInstalling Graphify git hooks...');
  run('graphify', ['hook', 'install'], { optional: true });

  console.log(
    '\nBuilding/updating Graphify knowledge graph (code-only, local AST)...',
  );
  if (existsSync('graphify-out/graph.json')) {
    run('pnpm', ['graphify:update'], { optional: true });
  } else {
    run('graphify', ['extract', '.', '--code-only', '--no-viz'], {
      optional: true,
    });
    run('graphify', ['cluster-only', '.', '--no-viz'], { optional: true });
  }
} else {
  console.log('\nGraphify CLI not found — skipping hooks and graph build.');
  console.log('Install later with: uv tool install graphifyy');
}

console.log('\nSetup complete.');
console.log('Cursor rule: .cursor/rules/graphify.mdc (alwaysApply: true)');
console.log('Next: pnpm dev');
