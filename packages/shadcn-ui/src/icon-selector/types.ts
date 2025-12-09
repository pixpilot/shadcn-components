export interface IconProviderProps {
  prefix: string;
  icons: string[];
  /**
   * Icon provider name (e.g., 'Material Design', 'FontAwesome', etc.)
   */
  name: string;
}

export type IconProviderLoader = () => Promise<IconProviderProps>;
export type IconProvider = IconProviderProps | IconProviderLoader;
