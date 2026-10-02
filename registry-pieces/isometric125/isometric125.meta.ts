import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric125",
  title: "Isometric Lighthouse",
  description:
    "A striped lighthouse stands on a rock in a ring of calm water. Its lamp glows in the accent color and a soft beam sweeps slowly around.",
  category: "Isometric",
  usage: `import { Isometric125 } from "@/components/beste/piece/isometric125";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric125 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Guide 1,000 new users to their first win.
  </p>
</div>`,
};
