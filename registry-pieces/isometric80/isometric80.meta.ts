import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric80",
  title: "Isometric Game Controller",
  description:
    "A chunky game controller lies flat with a cross pad, two thumbsticks and four face buttons. The four face buttons in the accent color press down one after another.",
  category: "Isometric",
  usage: `import { Isometric80 } from "@/components/beste/piece/isometric80";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric80 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Invite 4 friends, start a match in 1 click.
  </p>
</div>`,
};
