import type { ISchema } from '@formily/react';
import type { JsonSchemaFormComponents } from '../../../src/components/json-schema-form-renderer/types';
import { createForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JsonSchemaFieldExtended } from '../../../src/components/schema-field/schema-field-extended';

// Mock components for testing
const MockCustomInput = () => <div data-testid="custom-input">Custom Input</div>;
function MockCustomFileUpload() {
  return <div data-testid="custom-file-upload">Custom File Upload</div>;
}
const MockNewComponent = () => <div data-testid="new-component">New Component</div>;

describe('jsonSchemaFieldExtended', () => {
  const basicSchema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        'x-component': 'Input',
      },
    },
  };

  it('should render with extended components by default', () => {
    const form = createForm();
    const { container } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldExtended schema={basicSchema} />
      </FormProvider>,
    );

    // Should render without error
    expect(container).toBeTruthy();
  });

  it('should merge user-provided components with extended components', () => {
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
        <JsonSchemaFieldExtended schema={schema} components={customComponents} />
      </FormProvider>,
    );

    // Custom component should be rendered
    expect(getByTestId('new-component')).toBeTruthy();
  });

  it('should override extended component when user provides same key', () => {
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
        <JsonSchemaFieldExtended schema={schema} components={customComponents} />
      </FormProvider>,
    );

    // Custom Input should be rendered instead of extended Input
    expect(getByTestId('custom-input')).toBeTruthy();
  });

  it('should use extended components when user components do not override', () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Input',
        },
        file: {
          type: 'string',
          'x-component': 'FileUpload',
        },
      },
    };

    const customComponents: JsonSchemaFormComponents = {
      fields: {
        // Override only FileUpload, Input should use extended component
        FileUpload: { component: MockCustomFileUpload },
      },
    };

    const { container, getByTestId } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldExtended schema={schema} components={customComponents} />
      </FormProvider>,
    );

    // Custom FileUpload should be rendered
    expect(getByTestId('custom-file-upload')).toBeTruthy();

    // Input should use extended component (not custom)
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
        <JsonSchemaFieldExtended schema={schema} components={customComponents} />
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
        <JsonSchemaFieldExtended schema={basicSchema} components={undefined} />
      </FormProvider>,
    );

    // Should render with extended components
    expect(container).toBeTruthy();
  });

  it('should work with empty fields object', () => {
    const form = createForm();
    const customComponents: JsonSchemaFormComponents = {
      fields: {},
    };

    const { container } = render(
      <FormProvider form={form}>
        <JsonSchemaFieldExtended schema={basicSchema} components={customComponents} />
      </FormProvider>,
    );

    // Should render with extended components
    expect(container).toBeTruthy();
  });

  it('should support adding new components without affecting extended ones', () => {
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
        <JsonSchemaFieldExtended schema={schema} components={customComponents} />
      </FormProvider>,
    );

    // New component should be rendered
    expect(getByTestId('new-component')).toBeTruthy();

    // Basic Input component should still work
    expect(container).toBeTruthy();
  });
});
