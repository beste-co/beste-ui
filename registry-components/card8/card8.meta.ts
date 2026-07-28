import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card8",
  title: "Team Reveal Card",
  description:
    "A team member card with a grayscale portrait that gains color on hover while a bio drawer slides up.",
  category: "Card",
  usage: `import { Card8 } from "@/components/beste/component/card8";

// Hover or keyboard focus slides the drawer up and colors the portrait.
<Card8
  src="/team/deniz.jpg"
  name="Deniz Arslan"
  role="Creative Director"
  bio="Leads brand systems for venture backed startups."
  href="/team/deniz"
/>

<Card8
  src="/team/elif.jpg"
  name="Elif Kaya"
  role="Engineering Lead"
  colored              // skip the grayscale treatment
  linkLabel="Say hi"
  href="mailto:elif@studio.co"
  tone="foreground"    // link accent: "primary" (default) | "foreground"
/>`,
};
