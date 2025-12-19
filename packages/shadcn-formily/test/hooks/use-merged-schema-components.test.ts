import type { JsonSchemaFormComponents } from '../../src/components/json-schema-form-renderer/types';
import type { FormComponentRecord } from '../../src/types/form';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMergedSchemaComponents } from '../../src/hooks/use-merged-schema-components';

// Mock components for testing
const MockInput = () => null;
const MockTextarea = () => null;
const MockCheckbox = () => null;
const MockSelect = () => null;
const MockCustomComponent = () => null;
const MockDecorator = () => null;

describe('useMergedSchemaComponents', () => {
  const basicRegistry: FormComponentRecord = {
    Input: { component: MockInput, decorator: 'FormItem' },
    Textarea: { component: MockTextarea, decorator: 'FormItem' },
    Checkbox: { component: MockCheckbox, decorator: 'FormItem' },
  };

  it('should return basicRegistry when no user components provided', () => {
    const { result } = renderHook(() =>
      useMergedSchemaComponents(basicRegistry, undefined),
    );

    expect(result.current.fields).toEqual(basicRegistry);
    expect(result.current.decorators).toBeUndefined();
  });

  it('should merge user components with basic registry', () => {
    const userComponents: Partial<JsonSchemaFormComponents> = {
      fields: {
        Select: { component: MockSelect, decorator: 'FormItem' },
      },
    };

    const { result } = renderHook(() =>
      useMergedSchemaComponents(basicRegistry, userComponents),
    );

    expect(result.current.fields).toEqual({
      ...basicRegistry,
      Select: { component: MockSelect, decorator: 'FormItem' },
    });
  });

  it('should override basic component with user component when same key exists', () => {
    const userComponents: Partial<JsonSchemaFormComponents> = {
      fields: {
        Input: { component: MockCustomComponent, decorator: 'CustomDecorator' },
      },
    };

    const { result } = renderHook(() =>
      useMergedSchemaComponents(basicRegistry, userComponents),
    );

    // User component should override basic component
    expect(result.current.fields.Input).toEqual({
      component: MockCustomComponent,
      decorator: 'CustomDecorator',
    });
    // Other basic components should still exist
    expect(result.current.fields.Textarea).toEqual(basicRegistry.Textarea);
    expect(result.current.fields.Checkbox).toEqual(basicRegistry.Checkbox);
  });

  it('should include decorators from user components', () => {
    const userComponents: Partial<JsonSchemaFormComponents> = {
      decorators: {
        CustomDecorator: MockDecorator,
      },
    };

    const { result } = renderHook(() =>
      useMergedSchemaComponents(basicRegistry, userComponents),
    );

    expect(result.current.decorators).toEqual({
      CustomDecorator: MockDecorator,
    });
  });

  it('should merge both fields and decorators', () => {
    const userComponents: Partial<JsonSchemaFormComponents> = {
      fields: {
        Select: { component: MockSelect, decorator: 'FormItem' },
        Input: { component: MockCustomComponent },
      },
      decorators: {
        CustomDecorator: MockDecorator,
      },
    };

    const { result } = renderHook(() =>
      useMergedSchemaComponents(basicRegistry, userComponents),
    );

    expect(result.current.fields.Select).toEqual({
      component: MockSelect,
      decorator: 'FormItem',
    });
    expect(result.current.fields.Input).toEqual({
      component: MockCustomComponent,
    });
    expect(result.current.fields.Textarea).toEqual(basicRegistry.Textarea);
    expect(result.current.decorators).toEqual({
      CustomDecorator: MockDecorator,
    });
  });

  it('should handle empty user components objects', () => {
    const userComponents: Partial<JsonSchemaFormComponents> = {
      fields: {},
    };

    const { result } = renderHook(() =>
      useMergedSchemaComponents(basicRegistry, userComponents),
    );

    expect(result.current.fields).toEqual(basicRegistry);
    expect(result.current.decorators).toBeUndefined();
  });

  it('should memoize results and only recompute when dependencies change', () => {
    const userComponents: Partial<JsonSchemaFormComponents> = {
      fields: {
        Select: { component: MockSelect },
      },
    };

    const { result, rerender } = renderHook(
      ({ registry, components }) => useMergedSchemaComponents(registry, components),
      {
        initialProps: { registry: basicRegistry, components: userComponents },
      },
    );

    const firstResult = result.current;

    // Rerender with same props
    rerender({ registry: basicRegistry, components: userComponents });

    // Should return same reference (memoized)
    expect(result.current).toBe(firstResult);
  });

  it('should recompute when user components change', () => {
    const userComponents1: Partial<JsonSchemaFormComponents> = {
      fields: {
        Select: { component: MockSelect },
      },
    };

    const userComponents2: Partial<JsonSchemaFormComponents> = {
      fields: {
        Checkbox: { component: MockCustomComponent },
      },
    };

    const { result, rerender } = renderHook(
      ({ registry, components }) => useMergedSchemaComponents(registry, components),
      {
        initialProps: { registry: basicRegistry, components: userComponents1 },
      },
    );

    const firstResult = result.current;

    // Rerender with different user components
    rerender({ registry: basicRegistry, components: userComponents2 });

    // Should return different reference
    expect(result.current).not.toBe(firstResult);
    expect(result.current.fields.Select).toBeUndefined();
    expect(result.current.fields.Checkbox).toEqual({
      component: MockCustomComponent,
    });
  });

  it('should handle undefined fields in user components', () => {
    const userComponents: Partial<JsonSchemaFormComponents> = {
      decorators: {
        CustomDecorator: MockDecorator,
      },
    };

    const { result } = renderHook(() =>
      useMergedSchemaComponents(basicRegistry, userComponents),
    );

    expect(result.current.fields).toEqual(basicRegistry);
    expect(result.current.decorators).toEqual({
      CustomDecorator: MockDecorator,
    });
  });
});
