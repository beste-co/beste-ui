import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric136",
  title: "Isometric Lipstick",
  description:
    "A square lipstick case stands beside its open cap. The bullet in the accent color twists up out of the case, holds, then sinks back in.",
  category: "Isometric",
  usage: `import { Isometric136 } from "@/components/beste/piece/isometric136";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric136 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Try 24 shades before you buy 1.
  </p>
</div>`,
};
