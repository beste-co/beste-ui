import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric53",
  title: "Isometric Bank Vault",
  description:
    "The handle wheel on a heavy safe turns half a turn, then the thick door swings open on its hinge to show gold bars on two shelves before closing again.",
  category: "Isometric",
  usage: `import { Isometric53 } from "@/components/beste/piece/isometric53";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric53 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Funds held in insured accounts up to $250,000.
  </p>
</div>`,
};
