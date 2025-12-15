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

/**
 * ESLint rule to prevent ComponentProps<typeof Component> pattern with shadcn components.
 *
 * This rule detects when developers use `ComponentProps<typeof ShadcnComponent>` pattern
 * with components from @pixpilot/shadcn or @pixpilot/shadcn-ui packages.
 *
 * WHY THIS IS A PROBLEM:
 * When bundling TypeScript with tsdown, using `typeof ShadcnComponent` causes the bundler
 * to inline the component's type definition. This creates a flattened type structure that
 * contains internal implementation details like:
 *   } & Omit<react_day_picker0.DayPickerProps & {
 *     buttonVariant?: React.ComponentProps<typeof void 0>["variant"];
 *
 * This results in:
 * 1. Broken type references (typeof void 0, dangling references)
 * 2. Poor type portability when the type is exported and used elsewhere
 * 3. Maintenance nightmare: changes to internal implementation details break user types
 *
 * THE SOLUTION:
 * Component libraries should export explicit *Props types that are stable and documented.
 * Use: ComponentProps = {...} or DatePickerProps from the package's public API instead.
 *
 * EXAMPLE FIX:
 * ❌ WRONG:
 *   import { ShadcnDatePicker } from '@pixpilot/shadcn-ui';
 *   type MyProps = ComponentProps<typeof ShadcnDatePicker>;
 *
 * ✅ CORRECT:
 *   import { DatePickerProps } from '@pixpilot/shadcn-ui';
 *   type MyProps = DatePickerProps;
 */
const noTypeofShadcnComponents = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow typeof operator on @pixpilot/shadcn* components. Use exported *Props types instead to avoid bundler issues with inlined types.',
    },
    fixable: false,
    schema: [],
  },
  create(context) {
    // Build a map of imported shadcn components
    const importedShadcnComponents = new Map();

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (!source.startsWith('@pixpilot/shadcn-ui')) {
          return;
        }

        node.specifiers.forEach((spec) => {
          if (spec.type === 'ImportSpecifier') {
            importedShadcnComponents.set(spec.local.name, source);
          } else if (spec.type === 'ImportDefaultSpecifier') {
            importedShadcnComponents.set(spec.local.name, source);
          }
        });
      },
      TSTypeQuery(node) {
        // Check if this is typeof SomeComponent where SomeComponent is from shadcn
        if (!node.exprName || node.exprName.type !== 'Identifier') {
          return;
        }

        const componentName = node.exprName.name;

        // Only report if this component is imported from a shadcn package
        if (importedShadcnComponents.has(componentName)) {
          context.report({
            node,
            message: `Do not use typeof ${componentName} with @pixpilot/shadcn components. This causes the bundler to inline the component type, creating broken type references and poor type portability. Instead, import and use the exported ${componentName}Props type from the package's public API.`,
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
          'no-typeof-shadcn-components': noTypeofShadcnComponents,
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
      'custom/no-typeof-shadcn-components': 'error',
    },
  },
];
export default commonConfig;
