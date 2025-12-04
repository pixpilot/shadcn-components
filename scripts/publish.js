/* eslint-disable node/prefer-global/process */
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const SECRETS_FILE = '.env';
const TOKEN_REGEX = /^NPM_TOKEN=(?<temp1>.+)$/mu;

function main() {
  const args = process.argv.slice(2);
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

This script automatically reads the NPM_TOKEN from .env and uses it for authentication.
    `.trim(),
    );
    process.exit(0);
  }

  // Check if .env exists
  const secretsPath = path.join(process.cwd(), SECRETS_FILE);
  if (!fs.existsSync(secretsPath)) {
    console.error('❌ Error: .env file not found.');
    console.error('Please create it with your NPM token in this format:');
    console.error('NPM_TOKEN=YOUR_TOKEN_HERE');
    process.exit(1);
  }

  // Read and parse the token
  try {
    const secretsContent = fs.readFileSync(secretsPath, 'utf8');
    const tokenMatch = secretsContent.match(TOKEN_REGEX);

    if (!tokenMatch) {
      console.error('❌ Error: Could not find NPM_TOKEN in .env');
      console.error('Make sure the file contains: NPM_TOKEN=YOUR_TOKEN_HERE');
      process.exit(1);
    }

    const npmToken = tokenMatch[1].trim();
    if (!npmToken) {
      console.error('❌ Error: NPM_TOKEN is empty in .env');
      process.exit(1);
    }

    console.log('✓ Found NPM token in .env');

    // Run publish command with token in environment
    const publishCommand = isDryRun
      ? `pnpm changeset publish --dry-run${isNext ? ' --tag next' : ''}`
      : `pnpm changeset publish${isNext ? ' --tag next' : ''}`;

    console.log(`🚀 Running: ${publishCommand}`);

    if (isDryRun) {
      console.log('🔍 Running in dry-run mode...');
    }

    // Pass the token directly via environment variable
    const env = {
      ...process.env,
      NPM_TOKEN: npmToken,
      NODE_AUTH_TOKEN: npmToken, // Some tools use this instead
    };

    execSync(publishCommand, {
      stdio: 'inherit',
      env,
      cwd: process.cwd(),
    });

    console.log('✅ Publish completed successfully!');
  } catch (error) {
    console.error('❌ Error during publish:', error.message);
    process.exit(1);
  }
}

main();
