import type React from 'react';

/** Returns every key from a union type instead of only the shared keys. */
export type KeysOfUnion<T> = T extends T ? keyof T : never;

/** Component props that are custom to a wrapper after native element props are removed. */
export type OwnProps<T, El extends React.ElementType> = Exclude<
  Extract<KeysOfUnion<T>, string>,
  Extract<keyof React.ComponentProps<El>, string>
>;

/** Props that should be documented explicitly, plus optional extra native props. */
export type DocumentedProps<
  T,
  El extends React.ElementType,
  ExtraProps extends Extract<KeysOfUnion<T>, string> = never,
> = OwnProps<T, El> | ExtraProps;

/** Rich documentation for a single component prop. */
export interface ComponentPropDetails {
  /** Human-readable explanation of when and why to use the prop. */
  description: string;
  /** Display type for AI/docs output when the inferred TypeScript type is not enough. */
  type?: string;
  /** Default value shown to consumers when the component applies one. */
  defaultValue?: string;
  /** Whether consumers must provide the prop for normal usage. */
  required?: boolean;
  /** Enumerated allowed values when the prop accepts a known option set. */
  values?: readonly string[];
  /** Marks a prop as deprecated without removing it from generated metadata. */
  deprecated?: boolean;
  /** Additional usage notes for edge cases or related props. */
  notes?: readonly string[];
}

/** A prop can be documented with a short string or a richer details object. */
export type ComponentPropDescription = string | ComponentPropDetails;

/** Prop documentation keyed by prop name. */
export type ComponentPropDescriptions<Props extends string> = [Props] extends [never]
  ? Record<string, never>
  : { readonly [Prop in Props]-?: ComponentPropDescription };

/** Runnable or copyable usage sample returned by component detail tools. */
export interface ComponentExample {
  /** Short label for the example. */
  title: string;
  /** Optional explanation of what the example demonstrates. */
  description?: string;
  /** JSX or TypeScript snippet for the component usage. */
  code: string;
}

/** A package consumers must install separately for a specific component. */
export interface ComponentDependency {
  /** Package name to install. */
  name: string;
  /** Dependency purpose, used to distinguish install-time guidance from internals. */
  type?: 'runtime' | 'peer' | 'internal' | 'style';
  /** Extra install or usage details for this dependency. */
  notes?: string;
}

/** MCP metadata contract each component mcp.ts file exports as `meta`. */
export interface ComponentMeta<Props extends string = string> {
  /** Public component name used as the registry key. */
  name: string;
  /** Group name used by list tools and generated docs. */
  category: string;
  /** Concise summary of what the component does. */
  description: string;
  /** Native HTML element whose standard props are also supported, when applicable. */
  htmlElement?: string;
  /** Component-specific prop documentation. */
  props: ComponentPropDescriptions<Props>;
  /** Common usage examples for the component. */
  examples: readonly ComponentExample[];
  /**
   * Packages consumers must install separately in addition to the package that
   * provides this MCP server. Do not list dependencies already installed by
   * that package itself.
   */
  dependencies?: readonly (string | ComponentDependency)[];
  /** Search terms that help AI clients discover the component. */
  keywords?: readonly string[];
  /** Additional grouping labels for future docs or filtering. */
  tags?: readonly string[];
  /** Names of related components consumers may also need. */
  related?: readonly string[];
  /** Optional docs URL or local docs identifier. */
  docs?: string;
  /** Deprecation flag or message for legacy components. */
  deprecated?: boolean | string;
  /** Version where this component metadata became available. */
  since?: string;
  /** Component-level guidance not tied to a single prop. */
  notes?: readonly string[];
}

/** Registry shape consumed by the generic component MCP server. */
export type ComponentRegistry = Record<string, ComponentMeta>;
