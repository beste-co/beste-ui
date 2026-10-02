import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric88",
  title: "Isometric Reserved Table",
  description:
    "A round table for two with a pair of chairs, where a folded tent card in the accent color stands on the tabletop and reads Reserved, giving a small hop now and then as a sheen crosses it.",
  category: "Isometric",
  usage: `import { Isometric88 } from "@/components/beste/piece/isometric88";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric88 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Take bookings for 2 or 20 without a call.
  </p>
</div>`,
};
