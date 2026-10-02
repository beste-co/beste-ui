import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric25",
  title: "Isometric Rocket Launch",
  description:
    "A rocket with a nose cone, band and fins in the accent color stands on a round pad beside its service tower. The arm swings clear, the engine lights, exhaust clouds roll out across the pad and the rocket climbs away faster and faster before the scene resets.",
  category: "Isometric",
  usage: `import { Isometric25 } from "@/components/beste/piece/isometric25";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric25 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Ship the launch in one push.
  </p>
</div>`,
};
