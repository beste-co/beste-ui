import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric92",
  title: "Isometric Smart Thermostat",
  description:
    "A round thermostat sits on a small wall, and its dial ring lights tick by tick in the accent color while the number climbs to the set temperature.",
  category: "Isometric",
  usage: `import { Isometric92 } from "@/components/beste/piece/isometric92";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric92 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Save up to 12% on heating each month.
  </p>
</div>`,
};
