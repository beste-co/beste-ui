import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge18",
  title: "Countdown Badge",
  description:
    "A live countdown badge for launches and limited offers, SSR safe with a finished state.",
  category: "Badge",
  usage: `import { Badge18 } from "@/components/beste/component/badge18";

<Badge18 target="2027-01-01T00:00:00Z" label="Launch in" />

<Badge18
  target="2026-12-24T18:00:00Z"
  label="Early bird ends in"
  finishedText="Offer ended"   // shown once the target passes
  tone="primary"               // "foreground" (default) | "primary"
/>`,
};
