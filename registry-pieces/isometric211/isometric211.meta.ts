import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric211",
  title: "Isometric Site Motion",
  description:
    "A page lies flat on a desk and its sections rise out of it one after another on a soft ease, while the easing curve draws itself on a plate beside it and the knob in front of the plate turns. Everything holds, then eases back down.",
  category: "Isometric",
  usage: `import { Isometric211 } from "@/components/beste/piece/isometric211";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric211 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Motion set once, for the whole site.
  </p>
</div>`,
};
