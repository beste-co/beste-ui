import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric95",
  title: "Isometric Campsite",
  description:
    "A small tent stands on a patch of ground beside a ring of stones, where a campfire in the accent color burns on crossed logs, its flames flickering, throwing sparks and lighting the ground and the tent.",
  category: "Isometric",
  usage: `import { Isometric95 } from "@/components/beste/piece/isometric95";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric95 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Find 200 quiet campsites within 2 hours.
  </p>
</div>`,
};
