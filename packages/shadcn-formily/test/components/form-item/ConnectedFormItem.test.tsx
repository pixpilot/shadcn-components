import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormItem, Input } from '../../../src';

describe('connectedFormItem asterisk behavior', () => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
    },
  });

  it('should show asterisk for required field', () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    };

    render(
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>,
    );

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeTruthy();
    expect(asterisk.getAttribute('data-slot')).to.equal('form-item-label-asterisk');
  });

  it('should hide asterisk when x-decorator-props asterisk is false', () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          required: true,
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            asterisk: false,
          },
          'x-component': 'Input',
        },
      },
    };

    render(
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>,
    );

    const asterisk = screen.queryByText('*');
    expect(asterisk).toBeNull();
  });

  it('should show asterisk when x-decorator-props asterisk is true', () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            asterisk: true,
          },
          'x-component': 'Input',
        },
      },
    };

    render(
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>,
    );

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeTruthy();
    expect(asterisk.getAttribute('data-slot')).to.equal('form-item-label-asterisk');
  });

  it('should not show asterisk for optional field', () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    };

    render(
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>,
    );

    const asterisk = screen.queryByText('*');
    expect(asterisk).toBeNull();
  });
});
