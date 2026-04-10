# Generators

This directory contains code generators powered by [Scaffoldfy](https://pixpilot.github.io/scaffoldfy/). These generators help automate the creation of files and boilerplate for your monorepo.

## How it works

Each generator is configured via its own `scaffoldfy.json` file. Scaffoldfy reads these configuration files to determine what files and templates to generate.

## Usage Example

To run a generator, use the following command from the root of your repository:

```sh
npx @pixpilot/scaffoldfy --config ./generators/package/scaffoldfy.json
```

Replace `package/scaffoldfy.json` with the path to the specific generator you want to use.

This will prompt you for any required inputs and generate the files as defined in the configuration.

For more details, see the [Scaffoldfy documentation](https://pixpilot.github.io/scaffoldfy/).
