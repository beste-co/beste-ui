import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric13",
  title: "Isometric Code Window",
  description:
    "An editor window lies flat as an isometric slab while lines of code type in one after another, followed by a small raised cursor in the accent color.",
  category: "Isometric",
  usage: `import { Isometric13 } from "@/components/beste/piece/isometric13";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric13 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Deploy previews for every pull request in 30 seconds.
  </p>
</div>`,
};
