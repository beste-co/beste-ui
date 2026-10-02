import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric19",
  title: "Isometric Mail Envelope",
  description:
    "An upright envelope opens its flap and a letter in the accent color slides up out of it, then drops back in as the flap folds closed.",
  category: "Isometric",
  usage: `import { Isometric19 } from "@/components/beste/piece/isometric19";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric19 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Newsletters delivered to 50,000 inboxes a week.
  </p>
</div>`,
};
