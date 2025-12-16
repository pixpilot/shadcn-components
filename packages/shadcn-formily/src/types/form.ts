export type Space = 'sm' | 'md' | 'lg';

export interface FormSpace {
  density?: 'compact' | 'normal' | 'comfortable' | 'responsive';
}

export interface IconProvider {
  prefix: string;
  icons: string[];
  /**
   * Icon provider name (e.g., 'Material Design', 'FontAwesome', etc.)
   */
  name: string;
}

export interface FormComponentConfig {
  component: React.ComponentType<any>;
  decorator?: string;
}

export type FormComponentRecord = Record<string, FormComponentConfig>;
