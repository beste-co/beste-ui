import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-color",
  title: "Inspector Color",
  description:
    "Settings row that keeps the label, the colour value and a swatch on one pill; pressing the row opens the OKLCH colour picker below it, which is where the value is edited.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: ["color-picker"],
  usage: `import { InspectorColor } from "@/components/beste/component/inspector-color";

// The value is a readout, and the whole row opens the picker
<InspectorColor label="Color" defaultValue="#171717" />

// Controlled, with a separate commit for expensive work
<InspectorColor
  label="Dot color"
  value={dotColor}
  onValueChange={setDotColor}                          // every adjustment
  onValueCommit={(value) => console.log("persist", value)} // once per gesture
  swatches={["#171717", "#6366f1", "#0ea5e9", "#10b981"]}
/>

<InspectorColor
  label="Overlay"
  icon={Layers}          // optional leading icon
  value={overlay}
  onValueChange={setOverlay}
  alpha                  // 8-digit hex, checkerboard behind the swatch
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
/>

// Theme tokens: write oklch() back out
<InspectorColor
  label="Primary"
  format="oklch"
  value={theme.primary}
  onValueChange={(value) => console.log(value)}
/>`,
};
