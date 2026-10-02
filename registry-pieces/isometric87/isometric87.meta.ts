import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric87",
  title: "Isometric Dentist Chair",
  description:
    "A dental chair upholstered in the accent color leans back on its pedestal as the leg rest lifts, then the overhead lamp switches on and throws a cone of light onto the headrest before the chair sits up again.",
  category: "Isometric",
  usage: `import { Isometric87 } from "@/components/beste/piece/isometric87";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric87 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Book a checkup in under a minute.
  </p>
</div>`,
};
