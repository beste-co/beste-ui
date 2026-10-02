import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric60",
  title: "Isometric Approval Stamp",
  description:
    "A rubber stamp hovers over a sheet, presses down and lifts away, leaving a square check mark in the accent color printed on the page.",
  category: "Isometric",
  usage: `import { Isometric60 } from "@/components/beste/piece/isometric60";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric60 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Approvals signed off in 1 click.
  </p>
</div>`,
};
