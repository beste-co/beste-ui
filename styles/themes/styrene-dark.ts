import type { Theme } from "@/lib/themes/types";

export const styreneDarkTheme: Theme = {
  name: "styrene-dark",
  displayName: "Styrene",
  category: "dark",
  colors: {
    background: "oklch(0.2063 0.012 277.8347)",
    foreground: "oklch(0.9363 0.0433 183.9088)",
    card: "oklch(0.281 0.0177 227.3784)",
    cardForeground: "oklch(0.9363 0.0433 183.9088)",
    popover: "oklch(0.2149 0.0085 240.303)",
    popoverForeground: "oklch(0.8556 0.1555 179.7932)",
    primary: "oklch(0.8556 0.1555 179.7932)",
    primaryForeground: "oklch(0.2523 0.0373 174.7008)",
    secondary: "oklch(0.3675 0.0243 204.2418)",
    secondaryForeground: "oklch(0.8717 0.0093 258.3382)",
    muted: "oklch(0.2801 0.0188 225.3491)",
    mutedForeground: "oklch(0.7137 0.0192 261.3246)",
    accent: "oklch(0.3729 0.0306 259.7328)",
    accentForeground: "oklch(0.8717 0.0093 258.3382)",
    destructive: "oklch(0.7036 0.1665 59.092)",
    destructiveForeground: "oklch(0.2624 0.0145 181.5879)",
    border: "oklch(0.4911 0.034 196.1004)",
    input: "oklch(0.4291 0.0366 195.8739)",
    ring: "oklch(0.8556 0.1555 179.7932)",
    chart1: "oklch(0.8605 0.1497 187.8375)",
    chart2: "oklch(0.7883 0.1096 181.076)",
    chart3: "oklch(0.6223 0.0709 184.5682)",
    chart4: "oklch(0.4771 0.0398 212.3551)",
    chart5: "oklch(0.3253 0.0359 195.5305)",
    sidebar: "oklch(0.2769 0.0178 227.4018)",
    sidebarForeground: "oklch(0.9267 0.0356 172.117)",
    sidebarPrimary: "oklch(0.9018 0.0637 185.0301)",
    sidebarPrimaryForeground: "oklch(0.267 0.0141 188.8393)",
    sidebarAccent: "oklch(0.3488 0.0171 202.1737)",
    sidebarAccentForeground: "oklch(0.863 0.0329 198.9516)",
    sidebarBorder: "oklch(0.4705 0.0233 204.2805)",
    sidebarRing: "oklch(0.9067 0.071 189.3757)",
  },
  fonts: {
    sans: "tomorrow",
    serif: "biorhyme",
    mono: "jetbrains-mono",
  },
  radius: "0.15rem",
  trackingNormal: 0,
  shadows: {
    shadow2xs:
      "0px 0px 14px -2px hsl(174.9296 100% 86.0784% / 0.05)",
    shadowXs:
      "0px 0px 14px -2px hsl(174.9296 100% 86.0784% / 0.05)",
    shadowSm:
      "0px 0px 14px -2px hsl(174.9296 100% 86.0784% / 0.10), 0px 1px 2px -3px hsl(174.9296 100% 86.0784% / 0.10)",
    shadow:
      "0px 0px 14px -2px hsl(174.9296 100% 86.0784% / 0.10), 0px 1px 2px -3px hsl(174.9296 100% 86.0784% / 0.10)",
    shadowMd:
      "0px 0px 14px -2px hsl(174.9296 100% 86.0784% / 0.10), 0px 2px 4px -3px hsl(174.9296 100% 86.0784% / 0.10)",
    shadowLg:
      "0px 0px 14px -2px hsl(174.9296 100% 86.0784% / 0.10), 0px 4px 6px -3px hsl(174.9296 100% 86.0784% / 0.10)",
    shadowXl:
      "0px 0px 14px -2px hsl(174.9296 100% 86.0784% / 0.10), 0px 8px 10px -3px hsl(174.9296 100% 86.0784% / 0.10)",
    shadow2xl:
      "0px 0px 14px -2px hsl(174.9296 100% 86.0784% / 0.25)",
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 14,
    shadowSpread: -2,
    shadowColor: "#b8fff9",
    shadowOpacity: 0.1,
  },
};
