/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const packagesDir = path.join(__dirname, '..', 'packages');
const readmePath = path.join(__dirname, '..', 'README.md');

const packages = [];
const errors = [];

fs.readdirSync(packagesDir).forEach((dir) => {
  const packageJsonPath = path.join(packagesDir, dir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!packageJson.private) {
      if (!packageJson.description) {
        errors.push(
          `Package "${dir}" is missing a description in package.json. Solution: Add a "description" field to packages/${dir}/package.json`,
        );
      } else {
        packages.push({
          name: dir,
          description: packageJson.description,
        });
      }
    }
  }
});

if (errors.length > 0) {
  errors.forEach((error) => {
    console.error(`\x1B[31mError: ${error}\x1B[0m`);
  });
  process.exit(1);
}

// Sort packages alphabetically
packages.sort((a, b) => a.name.localeCompare(b.name));

const markdown = packages
  .map((p) => `### [${p.name}](./packages/${p.name}/README.md)\n\n${p.description}\n\n`)
  .join('');

const readme = fs.readFileSync(readmePath, 'utf8');

// Find the section between ## Packages and ## Contributing
const startMarker = readme.includes('## 📦 Packages') ? '## 📦 Packages' : '## Packages';
const endMarker = '\n## ';
const startIndex = readme.indexOf(startMarker);
const endIndex = readme.indexOf(endMarker, startIndex + startMarker.length);

if (startIndex === -1 || endIndex === -1) {
  throw new Error('Could not find the Packages section in README.md');
}

const contentStart = startIndex + startMarker.length;
const before = readme.substring(0, contentStart);
const after = readme.substring(endIndex);

const newReadme = `${before}\n\n${markdown}${after}`;

fs.writeFileSync(readmePath, newReadme);

console.log('README.md updated with packages.');
