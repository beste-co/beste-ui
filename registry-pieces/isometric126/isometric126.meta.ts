import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric126",
  title: "Isometric Robot Vacuum",
  description:
    "A round robot vacuum in the accent color glides across a rug and leaves a clean stripe behind it, then parks at the far edge before the loop starts over.",
  category: "Isometric",
  usage: `import { Isometric126 } from "@/components/beste/piece/isometric126";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric126 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Book a home clean in 60 seconds.
  </p>
</div>`,
};
