import type { Theme } from "@/lib/themes/types";

export const tiesenDarkTheme: Theme = {
  name: "tiesen-dark",
  displayName: "Tiesen",
  category: "dark",
  colors: {
    background: "oklch(0 0 0)",
    foreground: "oklch(1 0 0)",
    card: "oklch(0.1448 0 0)",
    cardForeground: "oklch(0.9461 0 0)",
    popover: "oklch(0.1448 0 0)",
    popoverForeground: "oklch(1 0 0)",
    primary: "oklch(0.5144 0.1605 267.44)",
    primaryForeground: "oklch(0.97 0.014 254.604)",
    secondary: "oklch(0.25 0 0)",
    secondaryForeground: "oklch(0.94 0 0)",
    muted: "oklch(0.23 0 0)",
    mutedForeground: "oklch(0.72 0 0)",
    accent: "oklch(0.32 0 0)",
    accentForeground: "oklch(0.9214 0.0248 257.65)",
    destructive: "oklch(0.704 0.191 22.216)",
    destructiveForeground: "oklch(0.97 0.014 254.604)",
    border: "oklch(0.26 0 0)",
    input: "oklch(0.32 0 0)",
    ring: "oklch(0.5144 0.1605 267.44)",
    chart1: "oklch(0.9214 0.0248 257.65)",
    chart2: "oklch(0.7597 0.0804 267.01)",
    chart3: "oklch(0.6083 0.1247 272.72)",
    chart4: "oklch(0.5144 0.1605 267.44)",
    chart5: "oklch(0.2571 0.1161 272.24)",
    sidebar: "oklch(0.1448 0 0)",
    sidebarForeground: "oklch(0.9461 0 0)",
    sidebarPrimary: "oklch(0.5144 0.1605 267.44)",
    sidebarPrimaryForeground: "oklch(0.97 0.014 254.604)",
    sidebarAccent: "oklch(0.32 0 0)",
    sidebarAccentForeground: "oklch(0.9214 0.0248 257.65)",
    sidebarBorder: "oklch(0.26 0 0)",
    sidebarRing: "oklch(0.5144 0.1605 267.44)",
  },
  fonts: {
    sans: "geist",
    serif: "noto-serif-georgian",
    mono: "geist-mono",
  },
  radius: "0.5rem",
  trackingNormal: 0,
  shadows: {
    shadow2xs:
      "0.25px 1px 3px 0px hsl(236.5829 64.225% 21.4383% / 0.07)",
    shadowXs:
      "0.25px 1px 3px 0px hsl(236.5829 64.225% 21.4383% / 0.07)",
    shadowSm:
      "0.25px 1px 3px 0px hsl(236.5829 64.225% 21.4383% / 0.15), 0.25px 1px 2px -1px hsl(236.5829 64.225% 21.4383% / 0.15)",
    shadow:
      "0.25px 1px 3px 0px hsl(236.5829 64.225% 21.4383% / 0.15), 0.25px 1px 2px -1px hsl(236.5829 64.225% 21.4383% / 0.15)",
    shadowMd:
      "0.25px 1px 3px 0px hsl(236.5829 64.225% 21.4383% / 0.15), 0.25px 2px 4px -1px hsl(236.5829 64.225% 21.4383% / 0.15)",
    shadowLg:
      "0.25px 1px 3px 0px hsl(236.5829 64.225% 21.4383% / 0.15), 0.25px 4px 6px -1px hsl(236.5829 64.225% 21.4383% / 0.15)",
    shadowXl:
      "0.25px 1px 3px 0px hsl(236.5829 64.225% 21.4383% / 0.15), 0.25px 8px 10px -1px hsl(236.5829 64.225% 21.4383% / 0.15)",
    shadow2xl:
      "0.25px 1px 3px 0px hsl(236.5829 64.225% 21.4383% / 0.38)",
    shadowX: 0.25,
    shadowY: 1,
    shadowBlur: 3,
    shadowSpread: 0,
    shadowColor: "oklch(0.2571 0.1161 272.24)",
    shadowOpacity: 0.15,
  },
};
