import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric45",
  title: "Isometric Treadmill",
  description:
    "A treadmill with side rails, a motor hood and a console on two uprights. Its belt scrolls steadily toward the rear roller while a speed readout in the accent color climbs bar by bar on the tilted screen, pulses and resets.",
  category: "Isometric",
  usage: `import { Isometric45 } from "@/components/beste/piece/isometric45";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric45 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Run 5 km before your first meeting.
  </p>
</div>`,
};
