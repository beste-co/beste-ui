import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric4",
  title: "Isometric Server Rack",
  description:
    "A rack of server units stands on a small plinth while a status LED on each unit blinks in turn, running from the top of the rack to the bottom.",
  category: "Isometric",
  usage: `import { Isometric4 } from "@/components/beste/piece/isometric4";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric4 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    99.99% uptime across 12 data centers.
  </p>
</div>`,
};
