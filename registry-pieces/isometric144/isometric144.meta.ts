import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric144",
  title: "Isometric Commuter Train",
  description:
    "A commuter train runs along its rails beside a platform, the sleepers sliding past beneath it, stops while its doors slide open and shut, then moves on. A stripe in the accent color runs the length of the car.",
  category: "Isometric",
  usage: `import { Isometric144 } from "@/components/beste/piece/isometric144";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric144 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Trains every 6 minutes at rush hour.
  </p>
</div>`,
};
