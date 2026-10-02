import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric74",
  title: "Isometric Event Ticket",
  description:
    "A large paper ticket with a notched stub and a perforation line hovers upright over a compact scanner. It dips toward the reader, the scan light glows in the accent color and a beam sweeps up its face.",
  category: "Isometric",
  usage: `import { Isometric74 } from "@/components/beste/piece/isometric74";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric74 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Check in 500 guests in under 10 minutes.
  </p>
</div>`,
};
