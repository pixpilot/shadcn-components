import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormItem, Input } from '../../../src';

describe('connectedFormItem required mark behavior', () => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
    },
  });

  it('should show the required mark for a required field', () => {
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

    const requiredMark = screen.getByText('*');
    expect(requiredMark).toBeTruthy();
    expect(requiredMark.getAttribute('data-slot')).to.equal(
      'form-item-label-required-mark',
    );
  });

  it('should hide the required mark when requiredMark is false', () => {
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
            requiredMark: false,
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

    const requiredMark = screen.queryByText('*');
    expect(requiredMark).toBeNull();
  });

  it('should show the required mark when requiredMark is true', () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            requiredMark: true,
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

    const requiredMark = screen.getByText('*');
    expect(requiredMark).toBeTruthy();
    expect(requiredMark.getAttribute('data-slot')).to.equal(
      'form-item-label-required-mark',
    );
  });

  it('should render a custom requiredMark node', () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            requiredMark: 'Required',
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

    const requiredMark = screen.getByText('Required');
    expect(requiredMark.getAttribute('data-slot')).to.equal(
      'form-item-label-required-mark',
    );
  });

  it('should support the deprecated asterisk prop', () => {
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

    expect(screen.getByText('*')).toBeTruthy();
  });

  it('should prefer requiredMark over the deprecated asterisk prop', () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            requiredMark: false,
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

    expect(screen.queryByText('*')).toBeNull();
  });

  it('should not show the required mark for an optional field', () => {
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

    const requiredMark = screen.queryByText('*');
    expect(requiredMark).toBeNull();
  });
});
