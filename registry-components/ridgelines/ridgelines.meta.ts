import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "ridgelines",
  title: "Ridgelines",
  description:
    "A Canvas 2D stacked ridgeline plot in the spirit of a pulsar chart: dozens of lines lifted by slow noise gathered in a central band, each filled to hide the ridges behind it, rising from flat on mount. Nearby lines lift under the cursor. Ink and paper colors, line count, ridge height, band width, speed, line weight and the cursor peak are all props. Pauses offscreen and holds a still plot for reduced motion.",
  category: "Background",
  isAnimated: true,
  demoContentOff: true,
  dependencies: [],
  usage: `import { Ridgelines } from "@/components/beste/component/ridgelines";

// A square cover panel
<Ridgelines className="aspect-square rounded-sm" />

<Ridgelines
  className="min-h-[32rem]"
  inkColor="var(--foreground)"    // any CSS color, tokens included
  paperColor="var(--background)"
  lines={40}                      // 12 to 96
  amplitude={0.7}                 // taller ridges
  spread={0.3}                    // a narrower central band
  weight={0.2}                    // finer lines
  riseIn={false}                  // skip the rise on mount
/>`,
};
