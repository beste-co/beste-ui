import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric44",
  title: "Isometric Dumbbell Rack",
  description:
    "Three dumbbells rest on a low gym rack. The one in front, its plates in the accent color, rolls a short way along the rails and back, its plates turning as it goes.",
  category: "Isometric",
  usage: `import { Isometric44 } from "@/components/beste/piece/isometric44";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric44 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Log every set in under 5 seconds.
  </p>
</div>`,
};
