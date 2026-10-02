import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric237",
  title: "Isometric Analytics Tag",
  description:
    "A page lies on a desk with a small tag module plugged into its side. Events appear on the page as small dots, and on the chart board beside it solid bars come up in answer, the newest one in the accent color.",
  category: "Isometric",
  usage: `import { Isometric237 } from "@/components/beste/piece/isometric237";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric237 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Tracking in place from day one.
  </p>
</div>`,
};
