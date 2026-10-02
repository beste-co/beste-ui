import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric243",
  title: "Isometric Client Handover",
  description:
    "Two pedestals stand side by side, joined by a bridge. A finished site on a tray, with its key lying beside it, slides across the bridge from the first pedestal to the second, whose name plate then takes the accent color.",
  category: "Isometric",
  usage: `import { Isometric243 } from "@/components/beste/piece/isometric243";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric243 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Hand over a finished project.
  </p>
</div>`,
};
