import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric156",
  title: "Isometric VR Headset",
  description:
    "A VR headset with a glossy visor and head strap rests on a display stand. A light strip in the accent color breathes along the visor while a glint crosses the glass and the status light blinks.",
  category: "Isometric",
  usage: `import { Isometric156 } from "@/components/beste/piece/isometric156";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric156 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Walk through 3 rooms before a single wall goes up.
  </p>
</div>`,
};
