import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { STORYBOOK_PORT } from '../.storybook/storybook-config.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const envFilePath = path.resolve(scriptDirectory, '../../../.env.local');
const require = createRequire(import.meta.url);

const storybookPackagePath = require.resolve('storybook/package.json');
const storybookCliPath = path.resolve(
  path.dirname(storybookPackagePath),
  'bin/index.cjs',
);

const storybookArgs = ['dev', '-p', String(STORYBOOK_PORT), '--no-open'];

if (fs.existsSync(envFilePath) && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(envFilePath);
}

const childProcess = spawn(process.execPath, [storybookCliPath, ...storybookArgs], {
  stdio: 'inherit',
});

childProcess.on('exit', (exitCode, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(exitCode ?? 0);
});
