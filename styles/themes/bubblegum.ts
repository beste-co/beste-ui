import type { Theme } from "@/lib/themes/types";

export const bubblegumTheme: Theme = {
  name: "bubblegum",
  displayName: "Bubblegum",
  category: "light",
  colors: {
    background: "oklch(0.9399 0.0203 345.6985)",
    foreground: "oklch(0.4712 0 0)",
    card: "oklch(0.9498 0.05 86.8891)",
    cardForeground: "oklch(0.4712 0 0)",
    popover: "oklch(1 0 0)",
    popoverForeground: "oklch(0.4712 0 0)",
    primary: "oklch(0.6209 0.1801 348.1385)",
    primaryForeground: "oklch(1 0 0)",
    secondary: "oklch(0.8095 0.0694 198.1863)",
    secondaryForeground: "oklch(0.3211 0 0)",
    muted: "oklch(0.88 0.0504 212.0952)",
    mutedForeground: "oklch(0.5795 0 0)",
    accent: "oklch(0.9195 0.0801 87.667)",
    accentForeground: "oklch(0.3211 0 0)",
    destructive: "oklch(0.7091 0.1697 21.9551)",
    destructiveForeground: "oklch(1 0 0)",
    border: "oklch(0.6209 0.1801 348.1385)",
    input: "oklch(0.9189 0 0)",
    ring: "oklch(0.7002 0.1597 350.7532)",
    chart1: "oklch(0.7002 0.1597 350.7532)",
    chart2: "oklch(0.8189 0.0799 212.0892)",
    chart3: "oklch(0.9195 0.0801 87.667)",
    chart4: "oklch(0.7998 0.111 348.1791)",
    chart5: "oklch(0.6197 0.1899 353.9091)",
    sidebar: "oklch(0.914 0.0424 343.0913)",
    sidebarForeground: "oklch(0.3211 0 0)",
    sidebarPrimary: "oklch(0.6559 0.2118 354.3084)",
    sidebarPrimaryForeground: "oklch(1 0 0)",
    sidebarAccent: "oklch(0.8228 0.1095 346.0184)",
    sidebarAccentForeground: "oklch(0.3211 0 0)",
    sidebarBorder: "oklch(0.9464 0.0327 307.1745)",
    sidebarRing: "oklch(0.6559 0.2118 354.3084)",
  },
  fonts: {
    sans: "poppins",
    serif: "lora",
    mono: "fira-code",
  },
  radius: "0.4rem",
  trackingNormal: 0,
  shadows: {
    shadow2xs:
      "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 0.50)",
    shadowXs:
      "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 0.50)",
    shadowSm:
      "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 1.00), 3px 1px 2px -1px hsl(325.78 58.18% 56.86% / 1.00)",
    shadow:
      "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 1.00), 3px 1px 2px -1px hsl(325.78 58.18% 56.86% / 1.00)",
    shadowMd:
      "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 1.00), 3px 2px 4px -1px hsl(325.78 58.18% 56.86% / 1.00)",
    shadowLg:
      "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 1.00), 3px 4px 6px -1px hsl(325.78 58.18% 56.86% / 1.00)",
    shadowXl:
      "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 1.00), 3px 8px 10px -1px hsl(325.78 58.18% 56.86% / 1.00)",
    shadow2xl:
      "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 2.50)",
    shadowX: 3,
    shadowY: 3,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: "hsl(325.78 58.18% 56.86% / 0.5)",
    shadowOpacity: 1.0,
  },
};
