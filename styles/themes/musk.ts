import { Theme } from "@/lib/themes/types";

export const muskTheme: Theme = {
  name: "musk",
  displayName: "Musk",
  category: "light",
  colors: {
    background: "oklch(0.99 0.005 90)", // Almost white, with a hint of cream
    foreground: "oklch(0.4 0.02 90)", // Soft, muted warm grey-brown
    card: "oklch(0.98 0.006 90)",
    cardForeground: "oklch(0.4 0.02 90)",
    popover: "oklch(0.98 0.006 90)",
    popoverForeground: "oklch(0.4 0.02 90)",
    primary: "oklch(0.85 0.04 20)", // Very soft, desaturated, powdery rose
    primaryForeground: "oklch(0.3 0.03 20)", // Darker rose for contrast
    secondary: "oklch(0.92 0.015 240)", // Very light, clean grey-blue
    secondaryForeground: "oklch(0.4 0.02 90)",
    muted: "oklch(0.95 0.005 90)",
    mutedForeground: "oklch(0.6 0.01 90)",
    accent: "oklch(0.8 0.07 85)", // Soft, warm amber/gold
    accentForeground: "oklch(0.3 0.04 85)",
    destructive: "oklch(0.75 0.1 15)", // Muted, desaturated red, almost a dusty rose
    destructiveForeground: "oklch(0.99 0.005 90)",
    border: "oklch(0.94 0.01 90)",
    input: "oklch(0.94 0.01 90)",
    ring: "oklch(0.85 0.04 20)",
    chart1: "oklch(0.85 0.04 20)", // primary
    chart2: "oklch(0.92 0.015 240)", // secondary
    chart3: "oklch(0.8 0.07 85)", // accent
    chart4: "oklch(0.75 0.05 50)", // a soft, muted green
    chart5: "oklch(0.8 0.03 300)", // a gentle lavender
    sidebar: "oklch(0.985 0.004 90)",
    sidebarForeground: "oklch(0.4 0.02 90)",
    sidebarPrimary: "oklch(0.85 0.04 20)",
    sidebarPrimaryForeground: "oklch(0.3 0.03 20)",
    sidebarAccent: "oklch(0.92 0.015 240)",
    sidebarAccentForeground: "oklch(0.4 0.02 90)",
    sidebarBorder: "oklch(0.95 0.005 90)",
    sidebarRing: "oklch(0.85 0.04 20)",
  },
  fonts: {
    sans: "inter",
    serif: "lora",
    mono: "geist-mono",
  },
  radius: "0.3rem",
  trackingNormal: 0,
  shadows: {
    shadow2xs: "0px 1px 2px 0px oklch(0.4 0.02 90 / 0.04)",
    shadowXs: "0px 1px 2px 0px oklch(0.4 0.02 90 / 0.06)",
    shadowSm:
      "0px 1px 2px 0px oklch(0.4 0.02 90 / 0.06), 0px 1px 2px -1px oklch(0.4 0.02 90 / 0.05)",
    shadow:
      "0px 1px 3px 0px oklch(0.4 0.02 90 / 0.08), 0px 1px 2px -1px oklch(0.4 0.02 90 / 0.05)",
    shadowMd:
      "0px 2px 4px -1px oklch(0.4 0.02 90 / 0.05), 0 4px 6px -1px oklch(0.4 0.02 90 / 0.08)",
    shadowLg:
      "0px 4px 6px -2px oklch(0.4 0.02 90 / 0.04), 0 10px 15px -3px oklch(0.4 0.02 90 / 0.08)",
    shadowXl:
      "0px 10px 10px -5px oklch(0.4 0.02 90 / 0.03), 0 20px 25px -5px oklch(0.4 0.02 90 / 0.08)",
    shadow2xl: "0 25px 50px -12px oklch(0.4 0.02 90 / 0.2)",
    shadowX: 0,
    shadowY: 1,
    shadowBlur: 2,
    shadowSpread: 0,
    shadowColor: "oklch(0.4 0.02 90)",
    shadowOpacity: 0.04,
  },
};
