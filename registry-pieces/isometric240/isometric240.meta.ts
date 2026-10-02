import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric240",
  title: "Isometric Protocol Server",
  description:
    "A compact server with vents and status lights stands on a desk with three ports on its front. Tool modules ride in along their rails and plug into the ports one after another, a link light comes on over each in the accent color, then they pull back out and rest.",
  category: "Isometric",
  usage: `import { Isometric240 } from "@/components/beste/piece/isometric240";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric240 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    One server, every tool your agent needs.
  </p>
</div>`,
};
