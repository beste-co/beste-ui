import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric194",
  title: "Isometric Stock Chart",
  description:
    "A phone lies flat on a desk with a stock chart on its screen. The line draws itself from left to right, a price pill in the accent color fades in where it ends, a row of solid volume bars stands on the glass and a short stack of coins sits beside the phone.",
  category: "Isometric",
  usage: `import { Isometric194 } from "@/components/beste/piece/isometric194";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric194 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Watch your portfolio in real time.
  </p>
</div>`,
};
