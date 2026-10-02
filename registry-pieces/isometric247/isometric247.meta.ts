import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric247",
  title: "Isometric Referral Earnings",
  description:
    "A thick pie of five equal wedges lies on a desk in front of a small project page on its stand. The wedge facing you, in the accent color, slides out of the pie again and again, and each time one more coin rises out of the well in front of it, so the stack grows while the rest of the pie stays where it is.",
  category: "Isometric",
  usage: `import { Isometric247 } from "@/components/beste/piece/isometric247";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric247 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Earn a share of every project you hand over.
  </p>
</div>`,
};
