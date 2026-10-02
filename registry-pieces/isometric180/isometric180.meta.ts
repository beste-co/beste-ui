import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric180",
  title: "Isometric Music Player",
  description:
    "A phone leans back on a small desk stand with a now playing screen: equalizer bars dance beside an album cover in the accent color, the progress knob travels along its track and notes drift up, with a pair of earbuds waiting in their open case.",
  category: "Isometric",
  usage: `import { Isometric180 } from "@/components/beste/piece/isometric180";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric180 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Your whole library, one tap away.
  </p>
</div>`,
};
