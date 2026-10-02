import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric99",
  title: "Isometric Ballot Box",
  description:
    "A ballot with a check in the accent color hovers over a lidded box, then slides down through the slot while the label on the front gives a small bump.",
  category: "Isometric",
  usage: `import { Isometric99 } from "@/components/beste/piece/isometric99";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric99 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Run a poll with 500 voters in 5 minutes.
  </p>
</div>`,
};
