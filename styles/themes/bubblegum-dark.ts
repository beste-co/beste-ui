import type { Theme } from "@/lib/themes/types";

export const bubblegumDarkTheme: Theme = {
  name: "bubblegum-dark",
  displayName: "Bubblegum",
  category: "dark",
  colors: {
    background: "oklch(0.2497 0.0305 234.1628)",
    foreground: "oklch(0.9306 0.0197 349.0785)",
    card: "oklch(0.2902 0.0299 233.5352)",
    cardForeground: "oklch(0.9306 0.0197 349.0785)",
    popover: "oklch(0.2902 0.0299 233.5352)",
    popoverForeground: "oklch(0.9306 0.0197 349.0785)",
    primary: "oklch(0.9195 0.0801 87.667)",
    primaryForeground: "oklch(0.2497 0.0305 234.1628)",
    secondary: "oklch(0.7794 0.0803 4.133)",
    secondaryForeground: "oklch(0.2497 0.0305 234.1628)",
    muted: "oklch(0.2713 0.0086 255.578)",
    mutedForeground: "oklch(0.7794 0.0803 4.133)",
    accent: "oklch(0.6699 0.0988 356.9762)",
    accentForeground: "oklch(0.9306 0.0197 349.0785)",
    destructive: "oklch(0.6702 0.1806 350.3599)",
    destructiveForeground: "oklch(0.2497 0.0305 234.1628)",
    border: "oklch(0.3907 0.0399 242.2181)",
    input: "oklch(0.3093 0.0305 232.0027)",
    ring: "oklch(0.6998 0.0896 201.8672)",
    chart1: "oklch(0.6998 0.0896 201.8672)",
    chart2: "oklch(0.7794 0.0803 4.133)",
    chart3: "oklch(0.6699 0.0988 356.9762)",
    chart4: "oklch(0.4408 0.0702 217.0848)",
    chart5: "oklch(0.2713 0.0086 255.578)",
    sidebar: "oklch(0.2303 0.027 235.9743)",
    sidebarForeground: "oklch(0.967 0.0029 264.5419)",
    sidebarPrimary: "oklch(0.6559 0.2118 354.3084)",
    sidebarPrimaryForeground: "oklch(1 0 0)",
    sidebarAccent: "oklch(0.8228 0.1095 346.0184)",
    sidebarAccentForeground: "oklch(0.2781 0.0296 256.848)",
    sidebarBorder: "oklch(0.3729 0.0306 259.7328)",
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
      "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 0.50)",
    shadowXs:
      "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 0.50)",
    shadowSm:
      "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 1.00), 3px 1px 2px -1px hsl(206.1538 28.0576% 27.2549% / 1.00)",
    shadow:
      "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 1.00), 3px 1px 2px -1px hsl(206.1538 28.0576% 27.2549% / 1.00)",
    shadowMd:
      "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 1.00), 3px 2px 4px -1px hsl(206.1538 28.0576% 27.2549% / 1.00)",
    shadowLg:
      "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 1.00), 3px 4px 6px -1px hsl(206.1538 28.0576% 27.2549% / 1.00)",
    shadowXl:
      "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 1.00), 3px 8px 10px -1px hsl(206.1538 28.0576% 27.2549% / 1.00)",
    shadow2xl:
      "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 2.50)",
    shadowX: 3,
    shadowY: 3,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: "#324859",
    shadowOpacity: 1.0,
  },
};
