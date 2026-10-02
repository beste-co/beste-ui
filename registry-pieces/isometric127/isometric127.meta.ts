import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric127",
  title: "Isometric Sink Plumbing",
  description:
    "Water drips from a joint in the pipes under a wall basin. A wrench in the accent color turns the nut twice and the drip stops.",
  category: "Isometric",
  usage: `import { Isometric127 } from "@/components/beste/piece/isometric127";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric127 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Leaks fixed the same day, parts included.
  </p>
</div>`,
};
