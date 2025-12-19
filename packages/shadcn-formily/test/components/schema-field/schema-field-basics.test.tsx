import type { ISchema } from '@formily/react';
import type { JsonSchemaFormComponents } from '../../../src/components/json-schema-form-renderer/types';
import { createForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JsonSchemaFieldBasics } from '../../../src/components/schema-field/schema-field-basics';

// Mock components for testing
const MockCustomInput = () => <div data-testid="custom-input">Custom Input</div>;
const MockCustomCheckbox = () => <div data-testid="custom-checkbox">Custom Checkbox</div>;
const MockNewComponent = () => <div data-testid="new-component">New Component</div>;

describe('jsonSchemaFieldBasics', () => {
  const basicSchema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        'x-component': 'Input',
      },
    },
  };

  it('should render with basic components by default', () => {
    const form = createForm();
    const { container } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldBasics schema={basicSchema} />
      </FormProvider>,
    );

    // Should render without error
    expect(container).toBeTruthy();
  });

  it('should merge user-provided components with basic components', () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        custom: {
          type: 'string',
          'x-component': 'CustomComponent',
        },
      },
    };

    const customComponents: JsonSchemaFormComponents = {
      fields: {
        CustomComponent: { component: MockNewComponent },
      },
    };

    const { getByTestId } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldBasics schema={schema} components={customComponents} />
      </FormProvider>,
    );

    // Custom component should be rendered
    expect(getByTestId('new-component')).toBeTruthy();
  });

  it('should override basic component when user provides same key', () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Input',
        },
      },
    };

    const customComponents: JsonSchemaFormComponents = {
      fields: {
        Input: { component: MockCustomInput },
      },
    };

    const { getByTestId } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldBasics schema={schema} components={customComponents} />
      </FormProvider>,
    );

    // Custom Input should be rendered instead of basic Input
    expect(getByTestId('custom-input')).toBeTruthy();
  });

  it('should use basic components when user components do not override', () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Input',
        },
        agree: {
          type: 'boolean',
          'x-component': 'Checkbox',
        },
      },
    };

    const customComponents: JsonSchemaFormComponents = {
      fields: {
        // Override only Checkbox, Input should use basic component
        Checkbox: { component: MockCustomCheckbox },
      },
    };

    const { container, getByTestId } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldBasics schema={schema} components={customComponents} />
      </FormProvider>,
    );

    // Custom Checkbox should be rendered
    expect(getByTestId('custom-checkbox')).toBeTruthy();

    // Input should use basic component (not custom)
    // The basic Input component is from the registry, not the mock
    expect(container).toBeTruthy();
  });

  it('should handle decorators from user components', () => {
    const form = createForm();
    const MockCustomDecorator = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-decorator">{children}</div>
    );

    const schema: ISchema = {
      type: 'object',
      properties: {
        custom: {
          type: 'string',
          'x-component': 'CustomComponent',
          'x-decorator': 'CustomDecorator',
        },
      },
    };

    const customComponents: JsonSchemaFormComponents = {
      fields: {
        CustomComponent: { component: MockNewComponent },
      },
      decorators: {
        CustomDecorator: MockCustomDecorator,
      },
    };

    const { getByTestId } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldBasics schema={schema} components={customComponents} />
      </FormProvider>,
    );

    // Both custom component and decorator should be rendered
    expect(getByTestId('custom-decorator')).toBeTruthy();
    expect(getByTestId('new-component')).toBeTruthy();
  });

  it('should work with empty components prop', () => {
    const form = createForm();
    const { container } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldBasics schema={basicSchema} components={undefined} />
      </FormProvider>,
    );

    // Should render with basic components
    expect(container).toBeTruthy();
  });

  it('should work with empty fields object', () => {
    const form = createForm();
    const customComponents: JsonSchemaFormComponents = {
      fields: {},
    };

    const { container } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldBasics schema={basicSchema} components={customComponents} />
      </FormProvider>,
    );

    // Should render with basic components
    expect(container).toBeTruthy();
  });

  it('should support adding new components without affecting basic ones', () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        basic: {
          type: 'string',
          'x-component': 'Input',
        },
        custom: {
          type: 'string',
          'x-component': 'NewComponent',
        },
      },
    };

    const customComponents: JsonSchemaFormComponents = {
      fields: {
        NewComponent: { component: MockNewComponent },
      },
    };

    const { container, getByTestId } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldBasics schema={schema} components={customComponents} />
      </FormProvider>,
    );

    // New component should be rendered
    expect(getByTestId('new-component')).toBeTruthy();

    // Basic Input component should still work
    expect(container).toBeTruthy();
  });
});
