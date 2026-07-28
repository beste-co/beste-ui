import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card27",
  title: "Community Card",
  description:
    "A compact community card with thumbnail, member count, and organizer row for directories and group lists.",
  category: "Card",
  usage: `import { Card27 } from "@/components/beste/component/card27";

// The whole card becomes a link when href is set.
<Card27
  src="/groups/night-shippers.jpg"
  title="Night Shippers"
  meta="312 members"
  byName="Deniz"
  href="/groups/night-shippers"
/>

<Card27
  src="/groups/design-club.jpg"
  title="Design Club"
  meta="94 members"
  byName="Elif"
  bySrc="/avatars/elif.jpg"   // or omit for the gradient dot
  tone="violet"               // dot: "peach" (default) | "violet" | "emerald"
/>`,
};
