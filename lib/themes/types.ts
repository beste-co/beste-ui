export type ThemeName = string;

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

import type { FontDefinition, FontName } from "@/lib/fonts/types";

/**
 * The built-in themes name catalogue fonts. A custom theme may also point at a
 * family the site added for itself, and that one has to carry its definition:
 * a name only resolves against the catalogue, which has never heard of it.
 */
export interface ThemeFonts {
  sans: FontName | FontDefinition;
  serif: FontName | FontDefinition;
  mono: FontName | FontDefinition;
}

export interface ThemeShadows {
  shadow2xs: string;
  shadowXs: string;
  shadowSm: string;
  shadow: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadow2xl: string;
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
  shadowSpread?: number;
  shadowOpacity?: number;
  shadowColor?: string;
}

export type ThemeCategory = "light" | "dark";

export interface Theme {
  name: ThemeName;
  displayName: string;
  category?: ThemeCategory;
  /** Original theme author/creator (e.g. tweakcn community themes). */
  author?: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  radius: string;
  trackingNormal: number;
  shadows: ThemeShadows;
  baseFontSize?: number; // Base font size in pixels (default: 16)
}

export interface ThemeContextType {
  currentTheme: ThemeName;
  customTheme: Theme | null;
  previewTheme?: Theme | null;
  setTheme: (theme: ThemeName) => void;
  setThemeWithFonts: (theme: ThemeName) => Promise<void>;
  getThemeStyles: () => Theme;
  applyCustomTheme: (theme: Theme) => Promise<void>;
  clearCustomTheme: () => Promise<void>;
  setPreviewTheme?: (theme: Theme | null) => void;
}
