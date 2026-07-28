import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card24",
  title: "CTA Card",
  description:
    "A call to action card with eyebrow, title, description, and buttons for section endings and banners.",
  category: "Card",
  usage: `import { Card24 } from "@/components/beste/component/card24";

<Card24
  eyebrow="Ready when you are"
  title="Start building today"
  description="Copy your first block in under a minute."
  cta="Browse blocks"
  href="/blocks"
  secondaryCta="See pricing"
  secondaryHref="/pricing"
/>

<Card24
  title="Join the newsletter"
  description="One email a month, only the good stuff."
  cta="Subscribe"
  href="/newsletter"
  tone="dark"   // "muted" (default) | "dark" | "primary"
/>`,
};
