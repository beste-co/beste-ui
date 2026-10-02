import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric105",
  title: "Isometric Office Printer",
  description:
    "An office printer feeds a sheet out onto its front tray in two short pulls, a bar chart printed on it in the accent color. Paper waits in the feeder on top.",
  category: "Isometric",
  usage: `import { Isometric105 } from "@/components/beste/piece/isometric105";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric105 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Invoices printed and filed in 2 clicks.
  </p>
</div>`,
};
