import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric146",
  title: "Isometric Taxi",
  description:
    "A checkered taxi cruises along the curb as the lane markings slide past, slows to a stop while its roof sign flickers on in the accent color, then the light goes out and it moves off.",
  category: "Isometric",
  usage: `import { Isometric146 } from "@/components/beste/piece/isometric146";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric146 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    A ride at your door in 4 minutes.
  </p>
</div>`,
};
