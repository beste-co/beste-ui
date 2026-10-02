import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric66",
  title: "Isometric Solar Panels",
  description:
    "Three tilted solar panels stand on a low frame, their cells in the accent color, while a soft glint of sunlight slides across the row from one end to the other.",
  category: "Isometric",
  usage: `import { Isometric66 } from "@/components/beste/piece/isometric66";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric66 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Track output from 240 panels at a glance.
  </p>
</div>`,
};
