"use client";

import { fontDefinitions } from "@/lib/fonts";
import type { FontName } from "@/lib/fonts";
import type { Theme, ThemeShadows } from "@/lib/themes";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { TweakCNImportDialog } from "./tweakcn-import-dialog";

interface CustomThemeEditorProps {
  initialTheme: Theme;
  availableThemes: Theme[];
  onSave: (theme: Theme) => Promise<void>;
  onCancel: () => void;
  onClearCustomTheme?: () => Promise<void>;
  onPreviewChange?: (theme: Theme) => void;
  isSaving: boolean;
  disabled?: boolean;
  showImportDialog?: boolean;
  onImportDialogOpenChange?: (open: boolean) => void;
  setShowImportDialog?: (open: boolean) => void;
}

type ThemeColorKey = keyof Theme["colors"];
type ShadowUtilityKey =
  | "shadow2xs"
  | "shadowXs"
  | "shadowSm"
  | "shadow"
  | "shadowMd"
  | "shadowLg"
  | "shadowXl"
  | "shadow2xl";

const OKLCH_REGEX = /^oklch\(\s*(\d*\.?\d+)\s+(\d*\.?\d+)\s+(\d*\.?\d+)\s*\)$/i;
const DEFAULT_SHADOW_COLOR = "oklch(0.5 0.2 300)";

const cloneTheme = (theme: Theme): Theme => {
  if (typeof structuredClone === "function") {
    return structuredClone(theme);
  }
  return JSON.parse(JSON.stringify(theme)) as Theme;
};

const normalizeThemeForEditing = (theme: Theme): Theme => {
  const cloned = cloneTheme(theme);
  const normalizedShadows = {
    ...(cloned.shadows ?? ({} as Theme["shadows"])),
  };

  if (normalizedShadows.shadowColor) {
    normalizedShadows.shadowColor = normalizeShadowColorValue(
      normalizedShadows.shadowColor
    );
  }

  const normalizedTheme: Theme = {
    ...cloned,
    name: "custom",
    displayName: cloned.displayName || "Custom Theme",
    colors: { ...cloned.colors },
    shadows: normalizedShadows,
    fonts: { ...cloned.fonts },
    trackingNormal: clampTracking(
      typeof cloned.trackingNormal === "number" ? cloned.trackingNormal : 0
    ),
  };

  const cleanupKeys: Array<keyof ThemeShadows> = [
    "shadowX",
    "shadowY",
    "shadowBlur",
    "shadowSpread",
    "shadowOpacity",
    "shadowColor",
  ];

  cleanupKeys.forEach((key) => {
    delete (normalizedTheme as unknown as Record<string, unknown>)[key];
  });

  return normalizedTheme;
};

const COLOR_GROUPS: Array<{
  title: string;
  items: Array<{ key: ThemeColorKey; label: string }>;
}> = [
  {
    title: "Surface & Text",
    items: [
      { key: "background", label: "Background" },
      { key: "foreground", label: "Foreground" },
      { key: "card", label: "Card" },
      { key: "cardForeground", label: "Card Foreground" },
      { key: "popover", label: "Popover" },
      { key: "popoverForeground", label: "Popover Foreground" },
    ],
  },
  {
    title: "Brand & Actions",
    items: [
      { key: "primary", label: "Primary" },
      { key: "primaryForeground", label: "Primary Foreground" },
      { key: "secondary", label: "Secondary" },
      { key: "secondaryForeground", label: "Secondary Foreground" },
      { key: "accent", label: "Accent" },
      { key: "accentForeground", label: "Accent Foreground" },
      { key: "muted", label: "Muted" },
      { key: "mutedForeground", label: "Muted Foreground" },
      { key: "destructive", label: "Destructive" },
      { key: "destructiveForeground", label: "Destructive Foreground" },
      { key: "border", label: "Border" },
      { key: "input", label: "Input" },
      { key: "ring", label: "Ring" },
    ],
  },
  {
    title: "Charts",
    items: [
      { key: "chart1", label: "Chart 1" },
      { key: "chart2", label: "Chart 2" },
      { key: "chart3", label: "Chart 3" },
      { key: "chart4", label: "Chart 4" },
      { key: "chart5", label: "Chart 5" },
    ],
  },
  {
    title: "Sidebar",
    items: [
      { key: "sidebar", label: "Sidebar" },
      { key: "sidebarForeground", label: "Sidebar Foreground" },
      { key: "sidebarPrimary", label: "Sidebar Primary" },
      {
        key: "sidebarPrimaryForeground",
        label: "Sidebar Primary Foreground",
      },
      { key: "sidebarAccent", label: "Sidebar Accent" },
      {
        key: "sidebarAccentForeground",
        label: "Sidebar Accent Foreground",
      },
      { key: "sidebarBorder", label: "Sidebar Border" },
      { key: "sidebarRing", label: "Sidebar Ring" },
    ],
  },
];

const TRACKING_MIN = -0.1;
const TRACKING_MAX = 0.1;

const clampTracking = (value: number) =>
  Math.min(Math.max(value, TRACKING_MIN), TRACKING_MAX);

type OklchComponents = {
  l: number;
  c: number;
  h: number;
};

// Convert oklch to hsl for shadow (simplified)
function convertOklchToHslForShadow(
  oklch: OklchComponents,
  opacity: number
): string {
  const { l, c, h } = oklch;
  const lightness = Math.round(l * 100);
  const saturation = Math.min(Math.round(c * 200), 100);
  return `hsl(${Math.round(h)} ${saturation}% ${lightness}% / ${opacity.toFixed(
    2
  )})`;
}

function convertHslToOklch(
  hue: number,
  saturationFraction: number,
  lightnessFraction: number
): string {
  return `oklch(${lightnessFraction.toFixed(3)} ${(
    saturationFraction * 0.25
  ).toFixed(3)} ${hue.toFixed(2)})`;
}

function normalizeShadowColorValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_SHADOW_COLOR;
  }
  const parsed = parseOklch(trimmed);
  if (parsed) {
    return formatOklch(parsed);
  }

  if (/^hsl\(/i.test(trimmed)) {
    const match = trimmed.match(
      /hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%(?:\s*\/\s*([\d.]+))?\)/i
    );
    if (match && match[1] && match[2] && match[3]) {
      const h = Number.parseFloat(match[1]) || 0;
      const s = (Number.parseFloat(match[2]) || 0) / 100;
      const l = (Number.parseFloat(match[3]) || 0) / 100;
      return convertHslToOklch(h, s, l);
    }
  }

  return trimmed;
}

// Generate all shadow variants based on shadow params
const generateShadowVariants = (
  x: number,
  y: number,
  blur: number,
  spread: number,
  color: string,
  opacity: number
): Theme["shadows"] => {
  const parsed = parseOklch(color);
  const fallbackOklch = parsed ||
    parseOklch(DEFAULT_SHADOW_COLOR) || { l: 0.5, c: 0.2, h: 300 };
  const shadows: Partial<Theme["shadows"]> = {};

  const baseShadow = convertOklchToHslForShadow(fallbackOklch, opacity);
  const subtleShadow = convertOklchToHslForShadow(fallbackOklch, opacity * 0.5);

  shadows.shadow2xs = `${x}px ${y}px ${Math.max(
    0,
    blur
  )}px ${spread}px ${subtleShadow}`;
  shadows.shadowXs = `${x}px ${y}px ${Math.max(
    0,
    blur
  )}px ${spread}px ${subtleShadow}`;

  const smBlur = Math.max(1, blur + 1);
  shadows.shadowSm = `${x}px ${y}px ${smBlur}px ${spread}px ${baseShadow}, ${x}px ${Math.max(
    0,
    y - 1
  )}px ${Math.max(1, blur + 1)}px ${Math.max(-1, spread - 1)}px ${baseShadow}`;
  shadows.shadow = shadows.shadowSm;

  const mdBlur = Math.max(2, blur + 2);
  shadows.shadowMd = `${x}px ${y}px ${mdBlur}px ${spread}px ${baseShadow}, ${x}px ${Math.max(
    0,
    y - 1
  )}px ${Math.max(2, blur + 2)}px ${Math.max(-1, spread - 1)}px ${baseShadow}`;

  const lgBlur = Math.max(4, blur + 4);
  shadows.shadowLg = `${x}px ${y}px ${lgBlur}px ${spread}px ${baseShadow}, ${x}px ${Math.max(
    0,
    y - 1
  )}px ${Math.max(4, blur + 4)}px ${Math.max(-1, spread - 1)}px ${baseShadow}`;

  const xlBlur = Math.max(8, blur + 8);
  shadows.shadowXl = `${x}px ${y}px ${xlBlur}px ${spread}px ${baseShadow}, ${x}px ${Math.max(
    0,
    y - 1
  )}px ${Math.max(8, blur + 8)}px ${Math.max(-1, spread - 1)}px ${baseShadow}`;

  const xl2Blur = Math.max(blur, blur * 2);
  shadows.shadow2xl = `${x}px ${y}px ${xl2Blur}px ${spread}px ${convertOklchToHslForShadow(
    fallbackOklch,
    Math.min(1, opacity * 2.5)
  )}`;

  shadows.shadowX = x;
  shadows.shadowY = y;
  shadows.shadowBlur = blur;
  shadows.shadowSpread = spread;
  shadows.shadowOpacity = opacity;
  shadows.shadowColor = parsed
    ? formatOklch(parsed)
    : normalizeShadowColorValue(color);

  return shadows as Theme["shadows"];
};

// Font name mapping from CSS font names to FontName
const mapFontName = (fontName: string): FontName => {
  const normalized = fontName
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/\s+/g, "-")
    .trim();

  // Direct match
  if (normalized in fontDefinitions) {
    return normalized as FontName;
  }

  // Try to match by display name
  const allFonts = Object.values(fontDefinitions);
  const matchedFont = allFonts.find(
    (font) =>
      font.displayName.toLowerCase() === fontName.toLowerCase() ||
      font.googleFontName?.toLowerCase() === fontName.toLowerCase() ||
      font.name.toLowerCase() === normalized
  );

  if (matchedFont) {
    return matchedFont.name;
  }

  // Fallback to default
  return "inter";
};

// Parse CSS and extract theme data
const parseTweakCNCSS = (
  css: string
): {
  root: Partial<Theme> | null;
  dark: Partial<Theme> | null;
} => {
  const rootTheme: Partial<Theme> = {
    colors: {} as Theme["colors"],
    shadows: {} as Theme["shadows"],
    fonts: {} as Theme["fonts"],
  };
  const darkTheme: Partial<Theme> = {
    colors: {} as Theme["colors"],
    shadows: {} as Theme["shadows"],
    fonts: {} as Theme["fonts"],
  };

  // Extract :root block (handle nested brackets)
  const rootContent = extractCSSBlock(css, ":root");
  if (rootContent) {
    parseCSSBlock(rootContent, rootTheme);
  }

  // Extract .dark block
  const darkContent = extractCSSBlock(css, ".dark");
  if (darkContent) {
    parseCSSBlock(darkContent, darkTheme);
  }

  return {
    root:
      rootTheme.colors && Object.keys(rootTheme.colors).length > 0
        ? rootTheme
        : null,
    dark:
      darkTheme.colors && Object.keys(darkTheme.colors).length > 0
        ? darkTheme
        : null,
  };
};

// Extract CSS block content handling nested brackets
const extractCSSBlock = (css: string, selector: string): string | null => {
  const selectorIndex = css.indexOf(selector);
  if (selectorIndex === -1) return null;

  let braceCount = 0;
  let startIndex = -1;

  // Find the opening brace
  for (let i = selectorIndex + selector.length; i < css.length; i++) {
    if (css[i] === "{") {
      if (startIndex === -1) {
        startIndex = i + 1;
      }
      braceCount++;
    } else if (css[i] === "}") {
      braceCount--;
      if (braceCount === 0 && startIndex !== -1) {
        return css.substring(startIndex, i);
      }
    }
  }

  return null;
};

const parseCSSBlock = (content: string, theme: Partial<Theme>): void => {
  // Parse CSS variables
  const varRegex = /--([^:]+):\s*([^;]+);/g;
  let match;
  const vars: Record<string, string> = {};

  while ((match = varRegex.exec(content)) !== null) {
    const [, key, value] = match;
    if (key && value) {
      vars[key.trim()] = value.trim();
    }
  }

  // Map colors
  const colorMap: Record<string, keyof Theme["colors"]> = {
    background: "background",
    foreground: "foreground",
    card: "card",
    "card-foreground": "cardForeground",
    popover: "popover",
    "popover-foreground": "popoverForeground",
    primary: "primary",
    "primary-foreground": "primaryForeground",
    secondary: "secondary",
    "secondary-foreground": "secondaryForeground",
    muted: "muted",
    "muted-foreground": "mutedForeground",
    accent: "accent",
    "accent-foreground": "accentForeground",
    destructive: "destructive",
    "destructive-foreground": "destructiveForeground",
    border: "border",
    input: "input",
    ring: "ring",
    "chart-1": "chart1",
    "chart-2": "chart2",
    "chart-3": "chart3",
    "chart-4": "chart4",
    "chart-5": "chart5",
    sidebar: "sidebar",
    "sidebar-foreground": "sidebarForeground",
    "sidebar-primary": "sidebarPrimary",
    "sidebar-primary-foreground": "sidebarPrimaryForeground",
    "sidebar-accent": "sidebarAccent",
    "sidebar-accent-foreground": "sidebarAccentForeground",
    "sidebar-border": "sidebarBorder",
    "sidebar-ring": "sidebarRing",
  };

  if (!theme.colors) {
    theme.colors = {} as Theme["colors"];
  }

  for (const [cssKey, themeKey] of Object.entries(colorMap)) {
    if (vars[cssKey]) {
      const value = vars[cssKey];
      // Remove var() wrapper if present
      const cleanValue = value.replace(/var\(--([^)]+)\)/, (_, varName) => {
        return vars[varName] || value;
      });
      (theme.colors as Theme["colors"])[themeKey] = cleanValue;
    }
  }

  // Map shadows
  const shadowMap: Record<string, keyof Theme["shadows"]> = {
    "shadow-2xs": "shadow2xs",
    "shadow-xs": "shadowXs",
    "shadow-sm": "shadowSm",
    shadow: "shadow",
    "shadow-md": "shadowMd",
    "shadow-lg": "shadowLg",
    "shadow-xl": "shadowXl",
    "shadow-2xl": "shadow2xl",
  };

  if (!theme.shadows) {
    theme.shadows = {} as Theme["shadows"];
  }

  for (const [cssKey, themeKey] of Object.entries(shadowMap)) {
    if (vars[cssKey]) {
      const value = vars[cssKey];
      const cleanValue = value.replace(/var\(--([^)]+)\)/, (_, varName) => {
        return vars[varName] || value;
      });
      (theme.shadows as unknown as Theme["shadows"])[themeKey] =
        cleanValue as never;
    }
  }

  // Map shadow parameters
  if (vars["shadow-x"]) {
    const xMatch = vars["shadow-x"].match(/([\d.-]+)px/);
    if (xMatch && xMatch[1]) {
      const value = parseFloat(xMatch[1]) || 0;
      (theme.shadows as Theme["shadows"]).shadowX = value;
    }
  }
  if (vars["shadow-y"]) {
    const yMatch = vars["shadow-y"].match(/([\d.-]+)px/);
    if (yMatch && yMatch[1]) {
      const value = parseFloat(yMatch[1]) || 0;
      (theme.shadows as Theme["shadows"]).shadowY = value;
    }
  }
  if (vars["shadow-blur"]) {
    const blurMatch = vars["shadow-blur"].match(/([\d.-]+)px/);
    if (blurMatch && blurMatch[1]) {
      const value = parseFloat(blurMatch[1]) || 0;
      (theme.shadows as Theme["shadows"]).shadowBlur = value;
    }
  }
  if (vars["shadow-spread"]) {
    const spreadMatch = vars["shadow-spread"].match(/([\d.-]+)px/);
    if (spreadMatch && spreadMatch[1]) {
      const value = parseFloat(spreadMatch[1]) || 0;
      (theme.shadows as Theme["shadows"]).shadowSpread = value;
    }
  }
  if (vars["shadow-opacity"]) {
    const opacityMatch = vars["shadow-opacity"].match(/([\d.]+)/);
    if (opacityMatch && opacityMatch[1]) {
      const value = parseFloat(opacityMatch[1]) || 0;
      (theme.shadows as Theme["shadows"]).shadowOpacity = value;
    }
  }
  if (vars["shadow-color"]) {
    const shadowColorValue = vars["shadow-color"];
    if (shadowColorValue.startsWith("hsl")) {
      const hslMatch = shadowColorValue.match(
        /hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%(?:\s*\/\s*([\d.]+))?\)/
      );
      if (hslMatch && hslMatch[1] && hslMatch[2] && hslMatch[3]) {
        const h = parseFloat(hslMatch[1] ?? "0");
        const s = parseFloat(hslMatch[2] ?? "0") / 100;
        const l = parseFloat(hslMatch[3] ?? "0") / 100;
        (theme.shadows as Theme["shadows"]).shadowColor = convertHslToOklch(
          h,
          s,
          l
        );
      } else {
        (theme.shadows as Theme["shadows"]).shadowColor = shadowColorValue;
      }
    } else if (shadowColorValue.startsWith("oklch")) {
      (theme.shadows as Theme["shadows"]).shadowColor = shadowColorValue;
    } else {
      (theme.shadows as Theme["shadows"]).shadowColor = shadowColorValue;
    }
  }

  if ((theme.shadows as Theme["shadows"]).shadowColor) {
    (theme.shadows as Theme["shadows"]).shadowColor = normalizeShadowColorValue(
      (theme.shadows as Theme["shadows"]).shadowColor as string
    );
  }

  // Map fonts
  if (!theme.fonts) {
    theme.fonts = {} as Theme["fonts"];
  }

  if (vars["font-sans"]) {
    const fontValue = vars["font-sans"];
    const fontMatch = fontValue.match(/([^,\s]+)/);
    if (fontMatch && fontMatch[1]) {
      theme.fonts.sans = mapFontName(fontMatch[1]);
    }
  }

  if (vars["font-serif"]) {
    const fontValue = vars["font-serif"];
    const fontMatch = fontValue.match(/([^,\s]+)/);
    if (fontMatch && fontMatch[1]) {
      theme.fonts.serif = mapFontName(fontMatch[1]);
    }
  }

  if (vars["font-mono"]) {
    const fontValue = vars["font-mono"];
    const fontMatch = fontValue.match(/([^,\s]+)/);
    if (fontMatch && fontMatch[1]) {
      theme.fonts.mono = mapFontName(fontMatch[1]);
    }
  }

  // Map radius
  if (vars.radius) {
    theme.radius = vars.radius;
  }

  // Map tracking-normal
  if (vars["tracking-normal"]) {
    const trackingValue = vars["tracking-normal"];
    const emMatch = trackingValue.match(/([\d.-]+)em/);
    if (emMatch && emMatch[1]) {
      theme.trackingNormal = parseFloat(emMatch[1]) || 0;
    }
  }
};

function parseOklch(value: string): OklchComponents | null {
  if (!value) return null;
  const match = value.trim().match(OKLCH_REGEX);
  if (!match) return null;
  const [, lStr, cStr, hStr] = match;
  if (!lStr || !cStr || !hStr) return null;
  const l = parseFloat(lStr);
  const c = parseFloat(cStr);
  const h = parseFloat(hStr);
  if (Number.isNaN(l) || Number.isNaN(c) || Number.isNaN(h)) {
    return null;
  }
  return { l, c, h };
}

const isValidOklch = (value: string): boolean => {
  const parsed = parseOklch(value);
  if (!parsed) return false;
  const { l, c, h } = parsed;
  return l >= 0 && l <= 1 && c >= 0 && c <= 0.5 && h >= 0 && h <= 360;
};

function formatOklch({ l, c, h }: OklchComponents): string {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);
  const formattedL = clamp(l, 0, 1)
    .toFixed(3)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
  const formattedC = clamp(c, 0, 0.5)
    .toFixed(3)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
  const normalizedHue = ((h % 360) + 360) % 360;
  const formattedH = normalizedHue
    .toFixed(2)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
  return `oklch(${formattedL} ${formattedC} ${formattedH})`;
}

const sanitizeComponents = (components: OklchComponents): OklchComponents => ({
  l: Math.min(Math.max(components.l, 0), 1),
  c: Math.min(Math.max(components.c, 0), 0.5),
  h: ((components.h % 360) + 360) % 360,
});

const isValidCSSUnit = (value: string): boolean => {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  const cssUnitRegex =
    /^-?\d*\.?\d+(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/;
  return cssUnitRegex.test(trimmed);
};

// Hex to OKLCH conversion
const hexToOklch = (hex: string): OklchComponents | null => {
  const cleanHex = hex.replace(/^#/, "");
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) return null;

  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  const x = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
  const y = 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb;
  const z = 0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb;

  const l_ = 0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z;
  const m_ = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z;
  const s_ = 0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z;

  const l__ = Math.cbrt(l_);
  const m__ = Math.cbrt(m_);
  const s__ = Math.cbrt(s_);

  const L = 0.2104542553 * l__ + 0.793617785 * m__ - 0.0040720468 * s__;
  const a = 1.9779984951 * l__ - 2.428592205 * m__ + 0.4505937099 * s__;
  const bVal = 0.0259040371 * l__ + 0.7827717662 * m__ - 0.808675766 * s__;

  const C = Math.sqrt(a * a + bVal * bVal);
  let H = (Math.atan2(bVal, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return {
    l: Math.max(0, Math.min(1, L)),
    c: Math.max(0, Math.min(0.5, C)),
    h: H,
  };
};

// OKLCH to Hex conversion
const oklchToHex = (components: OklchComponents): string => {
  const { l: L, c: C, h: H } = components;

  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const bVal = C * Math.sin(hRad);

  const l__ = L + 0.3963377774 * a + 0.2158037573 * bVal;
  const m__ = L - 0.1055613458 * a - 0.0638541728 * bVal;
  const s__ = L - 0.0894841775 * a - 1.291485548 * bVal;

  const l_ = l__ * l__ * l__;
  const m_ = m__ * m__ * m__;
  const s_ = s__ * s__ * s__;

  let lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  let lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  let lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

  const toGamma = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

  lr = Math.max(0, Math.min(1, toGamma(lr)));
  lg = Math.max(0, Math.min(1, toGamma(lg)));
  lb = Math.max(0, Math.min(1, toGamma(lb)));

  const toHex = (c: number) =>
    Math.round(c * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(lr)}${toHex(lg)}${toHex(lb)}`;
};

interface ColorSliderGroupProps {
  colorValue: string;
  onChange: (components: OklchComponents) => void;
}

const ColorSliderGroup = ({ colorValue, onChange }: ColorSliderGroupProps) => {
  const parsed = sanitizeComponents(
    parseOklch(colorValue) ?? { l: 0.5, c: 0.1, h: 180 }
  );
  const [localComponents, setLocalComponents] =
    useState<OklchComponents>(parsed);

  useEffect(() => {
    const next = parseOklch(colorValue);
    if (next) {
      setLocalComponents(sanitizeComponents(next));
    }
  }, [colorValue]);

  const handleComponentChange = (
    component: keyof OklchComponents,
    value: number
  ) => {
    const next = sanitizeComponents({ ...localComponents, [component]: value });
    setLocalComponents(next);
    onChange(next);
  };

  const handleHexChange = (hex: string) => {
    const oklch = hexToOklch(hex);
    if (oklch) {
      const sanitized = sanitizeComponents(oklch);
      setLocalComponents(sanitized);
      onChange(sanitized);
    }
  };

  const currentHex = oklchToHex(localComponents);

  return (
    <div className="space-y-3">
      <Tabs defaultValue="rgb" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="rgb" className="flex-1">
            RGB
          </TabsTrigger>
          <TabsTrigger value="oklch" className="flex-1">
            OKLCH
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rgb">
          <div className="flex justify-center pt-2">
            <ColorPicker
              color={currentHex}
              onChange={handleHexChange}
              className="!p-0"
            />
          </div>
        </TabsContent>

        <TabsContent value="oklch">
          <div
            className="h-8 w-full rounded border"
            style={{ backgroundColor: formatOklch(localComponents) }}
          />

          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground">
              Adjust OKLCH components for precise color control.
            </p>
            <SliderControl
              label="Lightness (L)"
              min={0}
              max={1}
              step={0.005}
              value={localComponents.l}
              onChange={(value) => handleComponentChange("l", value)}
            />
            <SliderControl
              label="Chroma (C)"
              min={0}
              max={0.5}
              step={0.005}
              value={localComponents.c}
              onChange={(value) => handleComponentChange("c", value)}
            />
            <SliderControl
              label="Hue (h)"
              min={0}
              max={360}
              step={1}
              value={localComponents.h}
              onChange={(value) => handleComponentChange("h", value)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SliderControlProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

const SliderControl = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: SliderControlProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-mono text-gray-500">
        {value.toFixed(step >= 1 ? 0 : 3)}
      </span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(vals: number[]) => onChange(vals[0] ?? value)}
    />
  </div>
);

export function CustomThemeEditor({
  initialTheme,
  availableThemes,
  onSave,
  onCancel,
  onClearCustomTheme,
  onPreviewChange,
  isSaving,
  disabled = false,
  showImportDialog: externalShowImportDialog,
  onImportDialogOpenChange,
  setShowImportDialog: setShowImportDialogProp,
}: CustomThemeEditorProps) {
  const [draftTheme, setDraftTheme] = useState<Theme>(
    normalizeThemeForEditing(initialTheme)
  );
  const [selectedBaseTheme, setSelectedBaseTheme] = useState<string>(
    initialTheme.name
  );
  const [openColorKey, setOpenColorKey] = useState<
    ThemeColorKey | "shadowColor" | null
  >(null);
  const [invalidColors, setInvalidColors] = useState<
    Record<ThemeColorKey, boolean>
  >(() => {
    const entries = Object.entries(initialTheme.colors) as Array<
      [ThemeColorKey, string]
    >;
    return entries.reduce<Record<ThemeColorKey, boolean>>(
      (acc, [key, value]) => {
        acc[key] = !isValidOklch(value);
        return acc;
      },
      {} as Record<ThemeColorKey, boolean>
    );
  });
  const [invalidRadius, setInvalidRadius] = useState<boolean>(
    !isValidCSSUnit(initialTheme.radius)
  );
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [shadowParams, setShadowParams] = useState({
    x: 0,
    y: 3,
    blur: 0,
    spread: 0,
    opacity: 0.18,
    color: DEFAULT_SHADOW_COLOR,
  });
  const [invalidShadowColor, setInvalidShadowColor] = useState(false);

  useEffect(() => {
    const normalized = normalizeThemeForEditing(initialTheme);
    setDraftTheme(normalized);

    const availableNames = new Set(availableThemes.map((theme) => theme.name));
    const nextBaseName = availableNames.has(initialTheme.name)
      ? initialTheme.name
      : availableThemes[0]?.name ?? normalized.name;

    setSelectedBaseTheme(nextBaseName);
    setInvalidColors(() => {
      const entries = Object.entries(normalized.colors) as Array<
        [ThemeColorKey, string]
      >;
      return entries.reduce<Record<ThemeColorKey, boolean>>(
        (acc, [key, value]) => {
          acc[key] = !isValidOklch(value);
          return acc;
        },
        {} as Record<ThemeColorKey, boolean>
      );
    });
    setInvalidRadius(!isValidCSSUnit(normalized.radius));

    // Load shadow params from theme
    const normalizedShadows = normalized.shadows ?? ({} as Theme["shadows"]);
    const nextShadowParams = {
      x: normalizedShadows.shadowX ?? 0,
      y: normalizedShadows.shadowY ?? 3,
      blur: normalizedShadows.shadowBlur ?? 0,
      spread: normalizedShadows.shadowSpread ?? 0,
      opacity: normalizedShadows.shadowOpacity ?? 0.18,
      color: normalizeShadowColorValue(
        normalizedShadows.shadowColor ?? DEFAULT_SHADOW_COLOR
      ),
    };
    setShadowParams(nextShadowParams);
    setInvalidShadowColor(!isValidOklch(nextShadowParams.color));
  }, [initialTheme, availableThemes]);

  // Notify parent about draft theme changes for live preview
  useEffect(() => {
    if (onPreviewChange) {
      onPreviewChange(normalizeThemeForEditing(draftTheme));
    }
  }, [draftTheme, onPreviewChange]);

  // Generate shadows from params whenever params change
  useEffect(() => {
    const generatedShadows = generateShadowVariants(
      shadowParams.x,
      shadowParams.y,
      shadowParams.blur,
      shadowParams.spread,
      shadowParams.color,
      shadowParams.opacity
    );
    setDraftTheme((prev) => ({
      ...prev,
      shadows: {
        ...prev.shadows,
        ...generatedShadows,
      },
    }));
  }, [shadowParams]);

  const handleShadowParamChange = (
    param: keyof typeof shadowParams,
    value: number | string
  ) => {
    if (param === "color") {
      const nextColor = typeof value === "string" ? value.trim() : `${value}`;
      setShadowParams((prev) => ({
        ...prev,
        color: nextColor,
      }));
      setInvalidShadowColor(!isValidOklch(nextColor));
      return;
    }

    const numericValue =
      typeof value === "number" ? value : Number.parseFloat(value);

    setShadowParams((prev) => ({
      ...prev,
      [param]: Number.isFinite(numericValue) ? numericValue : prev[param],
    }));
  };

  const updateColorValue = (key: ThemeColorKey, value: string) => {
    const normalizedValue = value.trim();
    setDraftTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: normalizedValue,
      },
    }));
    setInvalidColors((prev) => ({
      ...prev,
      [key]: !isValidOklch(normalizedValue),
    }));
  };

  const handleColorChange = (key: ThemeColorKey, value: string) => {
    updateColorValue(key, value);
  };

  const handleSliderChange = (
    key: ThemeColorKey,
    components: OklchComponents
  ) => {
    const formatted = formatOklch(components);
    updateColorValue(key, formatted);
  };

  const hasInvalidColors = useMemo(
    () => Object.values(invalidColors).some(Boolean),
    [invalidColors]
  );

  const hasValidationErrors = useMemo(
    () => hasInvalidColors || invalidRadius || invalidShadowColor,
    [hasInvalidColors, invalidRadius, invalidShadowColor]
  );

  const previewBoxShadow = useMemo(() => {
    const generated = generateShadowVariants(
      shadowParams.x,
      shadowParams.y,
      shadowParams.blur,
      shadowParams.spread,
      shadowParams.color,
      shadowParams.opacity
    );
    return generated.shadow ?? "none";
  }, [shadowParams]);

  const handleTrackingChange = (value: number) => {
    setDraftTheme((prev) => ({
      ...prev,
      trackingNormal: clampTracking(value),
    }));
  };

  const handleBaseThemeChange = (value: string) => {
    setSelectedBaseTheme(value);
    const baseTheme = availableThemes.find((theme) => theme.name === value);
    if (baseTheme) {
      const normalized = normalizeThemeForEditing(baseTheme);
      setDraftTheme(normalized);
      setInvalidColors(() => {
        const entries = Object.entries(normalized.colors) as Array<
          [ThemeColorKey, string]
        >;
        return entries.reduce<Record<ThemeColorKey, boolean>>(
          (acc, [key, currentValue]) => {
            acc[key] = !isValidOklch(currentValue);
            return acc;
          },
          {} as Record<ThemeColorKey, boolean>
        );
      });
      setInvalidRadius(!isValidCSSUnit(normalized.radius));
      setOpenColorKey(null);

      // Load shadow params from theme
      const baseShadows = normalized.shadows ?? ({} as Theme["shadows"]);
      const nextShadowParams = {
        x: baseShadows.shadowX ?? 0,
        y: baseShadows.shadowY ?? 3,
        blur: baseShadows.shadowBlur ?? 0,
        spread: baseShadows.shadowSpread ?? 0,
        opacity: baseShadows.shadowOpacity ?? 0.18,
        color: normalizeShadowColorValue(
          baseShadows.shadowColor ?? DEFAULT_SHADOW_COLOR
        ),
      };
      setShadowParams(nextShadowParams);
      setInvalidShadowColor(!isValidOklch(nextShadowParams.color));
    }
  };

  const handleSave = async () => {
    if (disabled) return;
    if (hasValidationErrors) return;
    await onSave(normalizeThemeForEditing(draftTheme));
  };

  const handleDialogChange = (open: boolean) => {
    if (onImportDialogOpenChange) {
      onImportDialogOpenChange(open);
    } else if (setShowImportDialogProp) {
      setShowImportDialogProp(open);
    } else {
      setShowImportDialog(open);
    }
  };

  const currentShowImportDialog = externalShowImportDialog ?? showImportDialog;

  const handleImportParsed = (parsedTheme: Partial<Theme>) => {
    const parsedShadows = parsedTheme.shadows ?? ({} as Theme["shadows"]);
    const nextShadowParams = {
      x: parsedShadows.shadowX ?? 0,
      y: parsedShadows.shadowY ?? 3,
      blur: parsedShadows.shadowBlur ?? 0,
      spread: parsedShadows.shadowSpread ?? 0,
      opacity: parsedShadows.shadowOpacity ?? 0.18,
      color: normalizeShadowColorValue(
        parsedShadows.shadowColor ?? DEFAULT_SHADOW_COLOR
      ),
    };
    setShadowParams(nextShadowParams);
    setInvalidShadowColor(!isValidOklch(nextShadowParams.color));
    applyParsedTheme(parsedTheme);
  };

  const applyParsedTheme = (parsedTheme: Partial<Theme>) => {
    const currentTheme = normalizeThemeForEditing(draftTheme);
    const parsedShadows = parsedTheme.shadows ?? ({} as Theme["shadows"]);
    const mergedShadows: Theme["shadows"] = {
      ...currentTheme.shadows,
      ...parsedShadows,
    };

    if (parsedShadows.shadowColor !== undefined) {
      mergedShadows.shadowColor = normalizeShadowColorValue(
        parsedShadows.shadowColor
      );
    }

    const updatedTheme: Theme = {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        ...(parsedTheme.colors || {}),
      },
      shadows: mergedShadows,
      fonts: {
        ...currentTheme.fonts,
        ...(parsedTheme.fonts || {}),
      },
      radius: parsedTheme.radius || currentTheme.radius,
      trackingNormal:
        parsedTheme.trackingNormal !== undefined
          ? clampTracking(parsedTheme.trackingNormal)
          : currentTheme.trackingNormal,
    };

    setDraftTheme(updatedTheme);

    // Validate colors
    const entries = Object.entries(updatedTheme.colors) as Array<
      [ThemeColorKey, string]
    >;
    setInvalidColors(
      entries.reduce<Record<ThemeColorKey, boolean>>((acc, [key, value]) => {
        acc[key] = !isValidOklch(value);
        return acc;
      }, {} as Record<ThemeColorKey, boolean>)
    );

    // Validate radius
    setInvalidRadius(!isValidCSSUnit(updatedTheme.radius));
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-6 px-4 py-6">
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-2 w-full">
              <Label
                className="font-medium text-base text-foreground"
                htmlFor="custom-theme-base"
              >
                Start from Theme
              </Label>
              <Select
                value={selectedBaseTheme}
                onValueChange={handleBaseThemeChange}
                disabled={disabled || isSaving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {availableThemes.map((theme) => (
                    <SelectItem value={theme.name} key={theme.name}>
                      {theme.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="font-medium text-base text-foreground">
                Or you can
              </Label>
              <Button
                variant="default"
                onClick={() => handleDialogChange(true)}
                disabled={disabled || isSaving}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  width="16"
                  height="16"
                  className="size-5"
                >
                  <path fill="none" d="M0 0h256v256H0z"></path>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="24"
                    d="m208 128-.2.2M168.2 167.8 128 208M192 40l-76.2 76.2M76.2 155.8 40 192"
                  ></path>
                  <circle
                    cx="188"
                    cy="148"
                    r="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="24"
                  ></circle>
                  <circle
                    cx="96"
                    cy="136"
                    r="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="24"
                  ></circle>
                </svg>
                Import from <strong>tweakcn</strong>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label
                className="font-medium text-base text-foreground"
                htmlFor="custom-theme-display-name"
              >
                Display Name
              </Label>
              <Input
                className="w-full"
                value={draftTheme.displayName}
                onChange={(event) =>
                  setDraftTheme((prev) => ({
                    ...prev,
                    displayName: event.target.value,
                  }))
                }
                disabled={disabled || isSaving}
              />
            </div>
            <div className="grid gap-2">
              <Label
                className="font-medium text-base text-foreground"
                htmlFor="custom-theme-radius"
              >
                Border Radius
              </Label>
              <Input
                value={draftTheme.radius}
                onChange={(event) => {
                  const value = event.target.value;
                  setDraftTheme((prev) => ({
                    ...prev,
                    radius: value,
                  }));
                  setInvalidRadius(!isValidCSSUnit(value));
                }}
                placeholder="e.g. 0.75rem"
                disabled={disabled || isSaving}
                className={invalidRadius ? "border-destructive" : ""}
              />
              {invalidRadius && (
                <p className="text-sm text-destructive">
                  Please enter a valid CSS unit (e.g., 0.75rem, 12px, 1em).
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label
                className="font-medium text-base text-foreground"
                htmlFor="custom-theme-tracking"
              >
                Tracking (Letter Spacing)
              </Label>
              <div className="flex items-center gap-3">
                <Slider
                  className="w-full"
                  value={[draftTheme.trackingNormal]}
                  onValueChange={(vals: number[]) =>
                    handleTrackingChange(vals[0] ?? draftTheme.trackingNormal)
                  }
                  min={TRACKING_MIN}
                  max={TRACKING_MAX}
                  step={0.0025}
                  disabled={disabled || isSaving}
                />
                <span className="text-sm font-mono text-gray-500 w-12 text-right">
                  {draftTheme.trackingNormal.toFixed(3)}em
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Adjust the base letter-spacing slightly (recommended range -0.1
                to 0.1 em).
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <Label className="font-medium text-base text-foreground">Colors</Label>
          {COLOR_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-sm font-semibold uppercase text-muted-foreground">
                {group.title}
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((item) => (
                  <div className="grid gap-2" key={item.key}>
                    <Label
                      className="font-medium text-base text-foreground"
                      htmlFor={`theme-color-${item.key}`}
                    >
                      {item.label}
                    </Label>
                    <div className="flex items-center gap-1">
                      <Popover
                        open={openColorKey === item.key}
                        onOpenChange={(open) =>
                          setOpenColorKey(open ? item.key : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="h-9 w-9 rounded border border-border flex-shrink-0"
                            style={{
                              backgroundColor: parseOklch(
                                draftTheme.colors[item.key]
                              )
                                ? draftTheme.colors[item.key]
                                : "transparent",
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-64 space-y-4"
                          side="top"
                        >
                          <ColorSliderGroup
                            colorValue={draftTheme.colors[item.key]}
                            onChange={(components) =>
                              handleSliderChange(item.key, components)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        value={draftTheme.colors[item.key]}
                        onChange={(event) => {
                          handleColorChange(item.key, event.target.value);
                        }}
                        onBlur={(event) => {
                          const parsed = parseOklch(event.target.value);
                          if (parsed) {
                            const formatted = formatOklch(parsed);
                            updateColorValue(item.key, formatted);
                          }
                        }}
                        disabled={disabled || isSaving}
                        className={`text-sm ${
                          invalidColors[item.key]
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                      />
                    </div>
                    {invalidColors[item.key] && (
                      <p className="text-sm text-destructive">
                        Value must match oklch(0.961 0.047 165.48) format.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <Label className="font-medium text-base text-foreground">Shadows</Label>

          {/* Shadow Parameters */}
          <div
            className="space-y-4 p-4 bg-background rounded-lg border border-border transition-all duration-300 ease-out"
            style={{ boxShadow: previewBoxShadow }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Shadow X */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="font-medium text-base text-foreground"
                    htmlFor="shadow-x"
                  >
                    X Offset
                  </Label>
                  <span className="text-sm font-mono text-muted-foreground">
                    {shadowParams.x}px
                  </span>
                </div>
                <Slider
                  className="w-full"
                  value={[shadowParams.x]}
                  onValueChange={(vals: number[]) =>
                    handleShadowParamChange("x", vals[0] ?? 0)
                  }
                  min={-20}
                  max={20}
                  step={1}
                  disabled={disabled || isSaving}
                />
              </div>

              {/* Shadow Y */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="font-medium text-base text-foreground"
                    htmlFor="shadow-y"
                  >
                    Y Offset
                  </Label>
                  <span className="text-sm font-mono text-muted-foreground">
                    {shadowParams.y}px
                  </span>
                </div>
                <Slider
                  className="w-full"
                  value={[shadowParams.y]}
                  onValueChange={(vals: number[]) =>
                    handleShadowParamChange("y", vals[0] ?? 0)
                  }
                  min={-20}
                  max={20}
                  step={1}
                  disabled={disabled || isSaving}
                />
              </div>

              {/* Shadow Blur */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="font-medium text-base text-foreground"
                    htmlFor="shadow-blur"
                  >
                    Blur
                  </Label>
                  <span className="text-sm font-mono text-muted-foreground">
                    {shadowParams.blur}px
                  </span>
                </div>
                <Slider
                  className="w-full"
                  value={[shadowParams.blur]}
                  onValueChange={(vals: number[]) =>
                    handleShadowParamChange("blur", vals[0] ?? 0)
                  }
                  min={0}
                  max={50}
                  step={1}
                  disabled={disabled || isSaving}
                />
              </div>

              {/* Shadow Spread */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="font-medium text-base text-foreground"
                    htmlFor="shadow-spread"
                  >
                    Spread
                  </Label>
                  <span className="text-sm font-mono text-gray-500">
                    {shadowParams.spread}px
                  </span>
                </div>
                <Slider
                  className="w-full"
                  value={[shadowParams.spread]}
                  onValueChange={(vals: number[]) =>
                    handleShadowParamChange("spread", vals[0] ?? 0)
                  }
                  min={-20}
                  max={20}
                  step={1}
                  disabled={disabled || isSaving}
                />
              </div>

              {/* Shadow Opacity */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="font-medium text-base text-foreground"
                    htmlFor="shadow-opacity"
                  >
                    Opacity
                  </Label>
                  <span className="text-sm font-mono text-muted-foreground">
                    {shadowParams.opacity.toFixed(2)}
                  </span>
                </div>
                <Slider
                  className="w-full"
                  value={[shadowParams.opacity]}
                  onValueChange={(vals: number[]) =>
                    handleShadowParamChange("opacity", vals[0] ?? 0)
                  }
                  min={0}
                  max={1}
                  step={0.01}
                  disabled={disabled || isSaving}
                />
              </div>

              {/* Shadow Color */}
              <div className="grid gap-2">
                <Label
                  className="font-medium text-base text-foreground"
                  htmlFor="shadow-color"
                >
                  Color (OKLCH)
                </Label>
                <div className="flex items-center gap-1">
                  <Popover
                    open={openColorKey === "shadowColor"}
                    onOpenChange={(open) =>
                      setOpenColorKey(open ? "shadowColor" : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-9 w-9 rounded border border-border flex-shrink-0"
                        style={{
                          backgroundColor: parseOklch(shadowParams.color)
                            ? shadowParams.color
                            : "transparent",
                        }}
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-64 space-y-4"
                      side="top"
                    >
                      <ColorSliderGroup
                        colorValue={shadowParams.color}
                        onChange={(components) => {
                          const formatted = formatOklch(components);
                          handleShadowParamChange("color", formatted);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={shadowParams.color}
                    onChange={(event) => {
                      handleShadowParamChange("color", event.target.value);
                    }}
                    onBlur={(event) => {
                      const parsed = parseOklch(event.target.value);
                      if (parsed) {
                        const formatted = formatOklch(parsed);
                        handleShadowParamChange("color", formatted);
                      }
                    }}
                    disabled={disabled || isSaving}
                    className={`font-mono text-sm ${
                      invalidShadowColor
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                  />
                </div>
                {invalidShadowColor && (
                  <p className="text-sm text-destructive">
                    Value must match oklch(0.961 0.047 165.48) format.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {onClearCustomTheme && (
          <Button
            variant="ghost"
            className="justify-start text-destructive hover:text-destructive/80 bg-destructive/10"
            onClick={() => {
              if (onClearCustomTheme) {
                void onClearCustomTheme();
              }
            }}
            disabled={disabled || isSaving}
          >
            Remove Custom Theme
          </Button>
        )}
      </div>

      <div className="border-t border-border px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="min-w-[90px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={disabled || isSaving || hasValidationErrors}
            className="min-w-[140px]"
          >
            {isSaving
              ? "Saving..."
              : hasValidationErrors
              ? invalidRadius
                ? "Fix Radius"
                : "Fix Colors"
              : "Save Custom Theme"}
          </Button>
        </div>
      </div>

      <TweakCNImportDialog
        open={currentShowImportDialog}
        onOpenChange={handleDialogChange}
        onParse={parseTweakCNCSS}
        onSelectTheme={handleImportParsed}
      />
    </div>
  );
}
