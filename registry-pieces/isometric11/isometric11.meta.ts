import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric11",
  title: "Isometric Network Map",
  description:
    "Five small nodes sit on a dotted platform around a hub in the accent color, linked by raised arcs that carry pulses out from the center.",
  category: "Isometric",
  usage: `import { Isometric11 } from "@/components/beste/piece/isometric11";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric11 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Requests routed to 5 regions in 40 ms.
  </p>
</div>`,
};
