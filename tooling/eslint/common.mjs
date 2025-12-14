/** @type {import('@pixpilot/eslint-config').TypedFlatConfigItem[]} */
const noAtComponentsImport = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow import from @/components, use @pixpilot/shadcn instead',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value.startsWith('@/components')) {
          context.report({
            node: node.source,
            message: 'Use @pixpilot/shadcn instead of @/components',
            fix(fixer) {
              const oldValue = node.source.value;
              const newValue = oldValue.replace(/^@\/components/u, '@pixpilot/shadcn');
              return fixer.replaceText(node.source, `'${newValue}'`);
            },
          });
        }
      },
    };
  },
};

const commonConfig = [
  { ignores: ['**/env.ts'] },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    plugins: {
      custom: {
        rules: {
          'no-at-components-import': noAtComponentsImport,
        },
      },
    },
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: "Use `import { env } from '~/env'` instead to ensure validated types.",
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          name: 'process',
          importNames: ['env'],
          message: "Use `import { env } from '~/env'` instead to ensure validated types.",
        },
      ],
      'custom/no-at-components-import': 'error',
    },
  },
];
export default commonConfig;
