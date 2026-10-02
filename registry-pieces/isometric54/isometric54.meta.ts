import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric54",
  title: "Isometric Receipt Printer",
  description:
    "A compact printer feeds a receipt up out of its slot line by line, ending on a total bar in the accent color, then clears it and prints again.",
  category: "Isometric",
  usage: `import { Isometric54 } from "@/components/beste/piece/isometric54";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric54 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Receipts printed in under 2 seconds.
  </p>
</div>`,
};
