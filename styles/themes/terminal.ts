import type { Theme } from "@/lib/themes/types";

export const terminalTheme: Theme = {
  name: "terminal",
  displayName: "Terminal",
  category: "dark",
  colors: {
    background: "oklch(0 0 0)",
    foreground: "oklch(0.8686 0.2776 144.4661)",
    card: "oklch(0.1149 0 0)",
    cardForeground: "oklch(0.8686 0.2776 144.4661)",
    popover: "oklch(0 0 0)",
    popoverForeground: "oklch(0.8686 0.2776 144.4661)",
    primary: "oklch(0.8686 0.2776 144.4661)",
    primaryForeground: "oklch(0 0 0)",
    secondary: "oklch(0.3053 0.1039 142.4953)",
    secondaryForeground: "oklch(0.8686 0.2776 144.4661)",
    muted: "oklch(0.1887 0.0642 142.4953)",
    mutedForeground: "oklch(0.5638 0.1872 143.245)",
    accent: "oklch(0.8686 0.2776 144.4661)",
    accentForeground: "oklch(0 0 0)",
    destructive: "oklch(0.628 0.2577 29.2339)",
    destructiveForeground: "oklch(1 0 0)",
    border: "oklch(0.3053 0.1039 142.4953)",
    input: "oklch(0 0 0)",
    ring: "oklch(0.8686 0.2776 144.4661)",
    chart1: "oklch(0.8686 0.2776 144.4661)",
    chart2: "oklch(0.5638 0.1872 143.245)",
    chart3: "oklch(0.3053 0.1039 142.4953)",
    chart4: "oklch(0.1179 0.0327 343.3438)",
    chart5: "oklch(0.8686 0.2776 144.4661)",
    sidebar: "oklch(0.1149 0 0)",
    sidebarForeground: "oklch(0.8686 0.2776 144.4661)",
    sidebarPrimary: "oklch(0.8686 0.2776 144.4661)",
    sidebarPrimaryForeground: "oklch(0 0 0)",
    sidebarAccent: "oklch(0.3053 0.1039 142.4953)",
    sidebarAccentForeground: "oklch(0.8686 0.2776 144.4661)",
    sidebarBorder: "oklch(0.3053 0.1039 142.4953)",
    sidebarRing: "oklch(0.8686 0.2776 144.4661)",
  },
  fonts: {
    sans: "geist-pixel-square",
    serif: "geist-pixel-square",
    mono: "geist-pixel-square",
  },
  radius: "0rem",
  trackingNormal: 0.1,
  shadows: {
    shadow2xs:
      "0px 0px 10px 1px hsl(135.2941 100% 50% / 0.10)",
    shadowXs:
      "0px 0px 10px 1px hsl(135.2941 100% 50% / 0.10)",
    shadowSm:
      "0px 0px 10px 1px hsl(135.2941 100% 50% / 0.20), 0px 1px 2px 0px hsl(135.2941 100% 50% / 0.20)",
    shadow:
      "0px 0px 10px 1px hsl(135.2941 100% 50% / 0.20), 0px 1px 2px 0px hsl(135.2941 100% 50% / 0.20)",
    shadowMd:
      "0px 0px 10px 1px hsl(135.2941 100% 50% / 0.20), 0px 2px 4px 0px hsl(135.2941 100% 50% / 0.20)",
    shadowLg:
      "0px 0px 10px 1px hsl(135.2941 100% 50% / 0.20), 0px 4px 6px 0px hsl(135.2941 100% 50% / 0.20)",
    shadowXl:
      "0px 0px 10px 1px hsl(135.2941 100% 50% / 0.20), 0px 8px 10px 0px hsl(135.2941 100% 50% / 0.20)",
    shadow2xl:
      "0px 0px 10px 1px hsl(135.2941 100% 50% / 0.50)",
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 10,
    shadowSpread: 1,
    shadowColor: "#00FF41",
    shadowOpacity: 0.2,
  },
};
