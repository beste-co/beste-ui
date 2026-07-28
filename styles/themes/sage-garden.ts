import type { Theme } from "@/lib/themes/types";

export const sageGardenTheme: Theme = {
  name: "sage-garden",
  displayName: "Sage Garden",
  category: "light",
  colors: {
    background: "oklch(0.9761 0.0041 91.4461)",
    foreground: "oklch(0.2417 0.0298 269.8827)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.2417 0.0298 269.8827)",
    popover: "oklch(1 0 0)",
    popoverForeground: "oklch(0.2417 0.0298 269.8827)",
    primary: "oklch(0.6333 0.0309 154.9039)",
    primaryForeground: "oklch(1 0 0)",
    secondary: "oklch(0.8596 0.0291 119.9919)",
    secondaryForeground: "oklch(0.2417 0.0298 269.8827)",
    muted: "oklch(0.9251 0.0071 88.645)",
    mutedForeground: "oklch(0.551 0.0234 264.3637)",
    accent: "oklch(0.8242 0.0221 136.6092)",
    accentForeground: "oklch(0.2417 0.0298 269.8827)",
    destructive: "oklch(0.5624 0.1743 26.1433)",
    destructiveForeground: "oklch(1 0 0)",
    border: "oklch(0.9251 0.0071 88.645)",
    input: "oklch(1 0 0)",
    ring: "oklch(0.6333 0.0309 154.9039)",
    chart1: "oklch(0.6333 0.0309 154.9039)",
    chart2: "oklch(0.7209 0.0489 120.9474)",
    chart3: "oklch(0.6744 0.0427 136.011)",
    chart4: "oklch(0.551 0.0234 264.3637)",
    chart5: "oklch(0.9251 0.0071 88.645)",
    sidebar: "oklch(0.9845 0.0026 106.4477)",
    sidebarForeground: "oklch(0.2417 0.0298 269.8827)",
    sidebarPrimary: "oklch(0.6333 0.0309 154.9039)",
    sidebarPrimaryForeground: "oklch(1 0 0)",
    sidebarAccent: "oklch(0.9251 0.0071 88.645)",
    sidebarAccentForeground: "oklch(0.2417 0.0298 269.8827)",
    sidebarBorder: "oklch(0.9251 0.0071 88.645)",
    sidebarRing: "oklch(0.6333 0.0309 154.9039)",
  },
  fonts: {
    sans: "antic",
    serif: "newsreader",
    mono: "jetbrains-mono",
  },
  radius: "0.35rem",
  trackingNormal: 0,
  shadows: {
    shadow2xs:
      "0px 1px 2px 0px hsl(225 27.7778% 14.1176% / 0.02)",
    shadowXs:
      "0px 1px 2px 0px hsl(225 27.7778% 14.1176% / 0.02)",
    shadowSm:
      "0px 1px 2px 0px hsl(225 27.7778% 14.1176% / 0.04), 0px 1px 2px -1px hsl(225 27.7778% 14.1176% / 0.04)",
    shadow:
      "0px 1px 2px 0px hsl(225 27.7778% 14.1176% / 0.04), 0px 1px 2px -1px hsl(225 27.7778% 14.1176% / 0.04)",
    shadowMd:
      "0px 1px 2px 0px hsl(225 27.7778% 14.1176% / 0.04), 0px 2px 4px -1px hsl(225 27.7778% 14.1176% / 0.04)",
    shadowLg:
      "0px 1px 2px 0px hsl(225 27.7778% 14.1176% / 0.04), 0px 4px 6px -1px hsl(225 27.7778% 14.1176% / 0.04)",
    shadowXl:
      "0px 1px 2px 0px hsl(225 27.7778% 14.1176% / 0.04), 0px 8px 10px -1px hsl(225 27.7778% 14.1176% / 0.04)",
    shadow2xl:
      "0px 1px 2px 0px hsl(225 27.7778% 14.1176% / 0.10)",
    shadowX: 0,
    shadowY: 1,
    shadowBlur: 2,
    shadowSpread: 0,
    shadowColor: "#1a1f2e",
    shadowOpacity: 0.04,
  },
};
