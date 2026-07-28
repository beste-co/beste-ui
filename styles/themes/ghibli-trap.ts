import type { Theme } from "@/lib/themes/types";

export const ghibliTrapTheme: Theme = {
  name: "ghibli-trap",
  displayName: "Ghibli Trap",
  category: "light",
  colors: {
    background: "oklch(0.9769 0.0306 96.8576)",
    foreground: "oklch(0.3366 0.0362 71.1861)",
    card: "oklch(0.9901 0.0161 95.2193)",
    cardForeground: "oklch(0.3366 0.0362 71.1861)",
    popover: "oklch(0.9901 0.0161 95.2193)",
    popoverForeground: "oklch(0.3366 0.0362 71.1861)",
    primary: "oklch(0.5406 0.0773 152.7118)",
    primaryForeground: "oklch(0.9769 0.0306 96.8576)",
    secondary: "oklch(0.7831 0.0441 141.9548)",
    secondaryForeground: "oklch(0.3451 0.0351 141.7358)",
    muted: "oklch(0.9275 0.0287 84.5927)",
    mutedForeground: "oklch(0.5472 0.0329 72.1187)",
    accent: "oklch(0.8513 0.0955 63.4068)",
    accentForeground: "oklch(0.3366 0.0362 71.1861)",
    destructive: "oklch(0.6488 0.14 33.8977)",
    destructiveForeground: "oklch(1 0 0)",
    border: "oklch(0.8962 0.0244 85.7909)",
    input: "oklch(0.9498 0.025 89.2134)",
    ring: "oklch(0.5406 0.0773 152.7118)",
    chart1: "oklch(0.5406 0.0773 152.7118)",
    chart2: "oklch(0.8513 0.0955 63.4068)",
    chart3: "oklch(0.7683 0.0647 239.3771)",
    chart4: "oklch(0.6488 0.14 33.8977)",
    chart5: "oklch(0.7831 0.0441 141.9548)",
    sidebar: "oklch(0.9613 0.0233 90.7506)",
    sidebarForeground: "oklch(0.3366 0.0362 71.1861)",
    sidebarPrimary: "oklch(0.5406 0.0773 152.7118)",
    sidebarPrimaryForeground: "oklch(1 0 0)",
    sidebarAccent: "oklch(0.9063 0.0288 84.5924)",
    sidebarAccentForeground: "oklch(0.3366 0.0362 71.1861)",
    sidebarBorder: "oklch(0.868 0.0325 89.1535)",
    sidebarRing: "oklch(0.5406 0.0773 152.7118)",
  },
  fonts: {
    sans: "quicksand",
    serif: "libre-baskerville",
    mono: "jetbrains-mono",
  },
  radius: "1.25rem",
  trackingNormal: 0.01,
  shadows: {
    shadow2xs:
      "0px 4px 15px 0px hsl(32.7273 32.6733% 19.8039% / 0.05)",
    shadowXs:
      "0px 4px 15px 0px hsl(32.7273 32.6733% 19.8039% / 0.05)",
    shadowSm:
      "0px 4px 15px 0px hsl(32.7273 32.6733% 19.8039% / 0.10), 0px 1px 2px -1px hsl(32.7273 32.6733% 19.8039% / 0.10)",
    shadow:
      "0px 4px 15px 0px hsl(32.7273 32.6733% 19.8039% / 0.10), 0px 1px 2px -1px hsl(32.7273 32.6733% 19.8039% / 0.10)",
    shadowMd:
      "0px 4px 15px 0px hsl(32.7273 32.6733% 19.8039% / 0.10), 0px 2px 4px -1px hsl(32.7273 32.6733% 19.8039% / 0.10)",
    shadowLg:
      "0px 4px 15px 0px hsl(32.7273 32.6733% 19.8039% / 0.10), 0px 4px 6px -1px hsl(32.7273 32.6733% 19.8039% / 0.10)",
    shadowXl:
      "0px 4px 15px 0px hsl(32.7273 32.6733% 19.8039% / 0.10), 0px 8px 10px -1px hsl(32.7273 32.6733% 19.8039% / 0.10)",
    shadow2xl:
      "0px 4px 15px 0px hsl(32.7273 32.6733% 19.8039% / 0.25)",
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 15,
    shadowSpread: 0,
    shadowColor: "#433422",
    shadowOpacity: 0.1,
  },
};
