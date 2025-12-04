/* eslint-disable node/prefer-global/process */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// #region src/publish.ts
const SECRETS_FILE = '.env';
const TOKEN_REGEX = /^NPM_TOKEN=(?<temp1>.+)$/mu;
function publish(options) {
  const { isDryRun, isNext } = options;
  const secretsPath = path.join(process.cwd(), SECRETS_FILE);
  if (!fs.existsSync(secretsPath)) {
    console.error('❌ Error: .env file not found.');
    console.error('Please create it with your NPM token in this format:');
    console.error('NPM_TOKEN=YOUR_TOKEN_HERE');
    process.exit(1);
  }
  try {
    const tokenMatch = fs.readFileSync(secretsPath, 'utf8').match(TOKEN_REGEX);
    if (!tokenMatch) {
      console.error('❌ Error: Could not find NPM_TOKEN in .env');
      console.error('Make sure the file contains: NPM_TOKEN=YOUR_TOKEN_HERE');
      process.exit(1);
    }
    const npmToken = tokenMatch.groups?.temp1?.trim();
    if (npmToken == null || npmToken === '') {
      console.error('❌ Error: NPM_TOKEN is empty in .env');
      process.exit(1);
    }
    console.log('✓ Found NPM token in .env');
    const tempNpmrcPath = path.join(process.cwd(), '.npmrc.temp');
    let npmrcContent = `//registry.npmjs.org/:_authToken=${npmToken}\n`;
    const mainNpmrcPath = path.join(process.cwd(), '.npmrc');
    if (fs.existsSync(mainNpmrcPath)) {
      npmrcContent = `${fs.readFileSync(mainNpmrcPath, 'utf8')}\n${npmrcContent}`;
      console.log('✓ Merged with existing .npmrc');
    }
    console.log('✓ Creating temporary .npmrc file...');
    fs.writeFileSync(tempNpmrcPath, npmrcContent);
    const publishCommand = isDryRun
      ? `pnpm changeset publish --dry-run${isNext ? ' --tag next' : ''}`
      : `pnpm changeset publish${isNext ? ' --tag next' : ''}`;
    console.log(`🚀 Running: ${publishCommand}`);
    if (isDryRun) console.log('🔍 Running in dry-run mode...');
    execSync(publishCommand, {
      stdio: 'inherit',
      env: {
        ...process.env,
        NPM_CONFIG_USERCONFIG: tempNpmrcPath,
      },
      cwd: process.cwd(),
    });
    console.log('✅ Publish completed successfully!');
    console.log('🧹 Cleaning up temporary .npmrc file...');
    fs.unlinkSync(tempNpmrcPath);
    console.log('✓ Temporary file removed safely');
  } catch (error) {
    console.error(
      '❌ Error during publish:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

const ARGS_START_INDEX = 2;

const args = process.argv.slice(ARGS_START_INDEX);
const isDryRun = args.includes('--dry-run') || args.includes('-d');
const isNext = args.includes('--next');
const isHelp = args.includes('--help') || args.includes('-h');

if (isHelp) {
  console.log(
    `

Usage: node publish.js [options]

Options:
  --dry-run, -d    Run changeset publish with --dry-run flag
  --next           Publish to the next tag
  --help, -h       Show this help message

This script automatically reads the NPM_TOKEN from .env
and creates a temporary .npmrc file for authentication.
    `.trim(),
  );
  process.exit(0);
}

publish({ isDryRun, isNext });
