import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric199",
  title: "Isometric Settings Toggles",
  description:
    "A phone lies flat on the desk with a settings list on its screen. The switches slide on one after another, one row in the accent color, hold, and slide back off.",
  category: "Isometric",
  usage: `import { Isometric199 } from "@/components/beste/piece/isometric199";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric199 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every setting is one tap away.
  </p>
</div>`,
};
