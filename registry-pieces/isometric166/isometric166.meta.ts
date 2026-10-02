import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric166",
  title: "Isometric Toaster",
  description:
    "A rounded toaster takes two slices in the accent color down with its lever, glows while they brown, then pops them back up out of the slots with a small bounce.",
  category: "Isometric",
  usage: `import { Isometric166 } from "@/components/beste/piece/isometric166";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric166 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Breakfast is ready when you are.
  </p>
</div>`,
};
