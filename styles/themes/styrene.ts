import type { Theme } from "@/lib/themes/types";

export const styreneTheme: Theme = {
  name: "styrene",
  displayName: "Styrene",
  category: "light",
  colors: {
    background: "oklch(0.9842 0.0034 247.8575)",
    foreground: "oklch(0.3013 0.024 238.809)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.3193 0.0228 209.5983)",
    popover: "oklch(1 0 0)",
    popoverForeground: "oklch(0.3249 0.0245 200.142)",
    primary: "oklch(0.52 0.049 147.7951)",
    primaryForeground: "oklch(1 0 0)",
    secondary: "oklch(0.9276 0.0058 264.5313)",
    secondaryForeground: "oklch(0.4073 0.029 176.1402)",
    muted: "oklch(0.967 0.0029 264.5419)",
    mutedForeground: "oklch(0.3025 0.0164 156.1138)",
    accent: "oklch(0.9181 0.0477 145.1734)",
    accentForeground: "oklch(0.4091 0.0226 200.5214)",
    destructive: "oklch(0.5664 0.2031 32.6994)",
    destructiveForeground: "oklch(1 0 0)",
    border: "oklch(0.8717 0.0093 258.3382)",
    input: "oklch(0.9163 0.025 143.4909)",
    ring: "oklch(0.7099 0.0954 147.5011)",
    chart1: "oklch(0.8726 0.0394 172.0127)",
    chart2: "oklch(0.7384 0.0617 162.7135)",
    chart3: "oklch(0.626 0.051 162.7833)",
    chart4: "oklch(0.5002 0.059 162.0581)",
    chart5: "oklch(0.4401 0.0634 145.8323)",
    sidebar: "oklch(0.967 0.0029 264.5419)",
    sidebarForeground: "oklch(0.3277 0.0256 195.975)",
    sidebarPrimary: "oklch(0.52 0.049 147.7951)",
    sidebarPrimaryForeground: "oklch(1 0 0)",
    sidebarAccent: "oklch(0.8971 0.047 146.1388)",
    sidebarAccentForeground: "oklch(0.4109 0.0239 188.316)",
    sidebarBorder: "oklch(0.8657 0.0288 199.3627)",
    sidebarRing: "oklch(0.8758 0.0571 147.4218)",
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
      "0px 0px 14px -2px hsl(116 28.3019% 10.3922% / 0.05)",
    shadowXs:
      "0px 0px 14px -2px hsl(116 28.3019% 10.3922% / 0.05)",
    shadowSm:
      "0px 0px 14px -2px hsl(116 28.3019% 10.3922% / 0.10), 0px 1px 2px -3px hsl(116 28.3019% 10.3922% / 0.10)",
    shadow:
      "0px 0px 14px -2px hsl(116 28.3019% 10.3922% / 0.10), 0px 1px 2px -3px hsl(116 28.3019% 10.3922% / 0.10)",
    shadowMd:
      "0px 0px 14px -2px hsl(116 28.3019% 10.3922% / 0.10), 0px 2px 4px -3px hsl(116 28.3019% 10.3922% / 0.10)",
    shadowLg:
      "0px 0px 14px -2px hsl(116 28.3019% 10.3922% / 0.10), 0px 4px 6px -3px hsl(116 28.3019% 10.3922% / 0.10)",
    shadowXl:
      "0px 0px 14px -2px hsl(116 28.3019% 10.3922% / 0.10), 0px 8px 10px -3px hsl(116 28.3019% 10.3922% / 0.10)",
    shadow2xl:
      "0px 0px 14px -2px hsl(116 28.3019% 10.3922% / 0.25)",
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 14,
    shadowSpread: -2,
    shadowColor: "#142213",
    shadowOpacity: 0.1,
  },
};
