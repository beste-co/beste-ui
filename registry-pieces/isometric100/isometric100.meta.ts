import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric100",
  title: "Isometric Trophy Podium",
  description:
    "A trophy in the accent color stands on the top step of a three place podium while small pieces of confetti drift down and turn around it.",
  category: "Isometric",
  usage: `import { Isometric100 } from "@/components/beste/piece/isometric100";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric100 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Reward your top 3 players every week.
  </p>
</div>`,
};
