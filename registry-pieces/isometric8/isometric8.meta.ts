import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric8",
  title: "Isometric Secure Lock",
  description:
    "A padlock stands on a small platform. Its round shackle lifts until the short leg clears its hole, holds open, then drops shut with a click that bumps the small shield mark in the accent color.",
  category: "Isometric",
  usage: `import { Isometric8 } from "@/components/beste/piece/isometric8";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric8 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Encrypted at rest with AES-256.
  </p>
</div>`,
};
