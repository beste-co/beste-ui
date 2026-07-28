import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-multicolor",
  title: "Inspector Multicolor",
  description:
    "Settings row for a list of colours: a swatch per stop, each opening the OKLCH picker, and a remove and add pair at the far right bounded by min and max.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: ["color-picker"],
  usage: `import { InspectorMulticolor } from "@/components/beste/component/inspector-multicolor";

// Uncontrolled
<InspectorMulticolor label="Color stops" defaultValue={["#3a29ff", "#ff94b4", "#ff3232"]} />

// Controlled, with a separate commit for expensive work. Gradients and shader
// backgrounds are the usual reason to want one.
<InspectorMulticolor
  label="Color stops"
  value={colorStops}
  onValueChange={setColorStops}                          // every adjustment
  onValueCommit={(value) => console.log("persist", value)} // release, add, remove
  min={1}
  max={3}
/>

<InspectorMulticolor
  label="Palette"
  icon={Palette}         // optional leading icon
  min={2}
  max={6}
  newColor="#171717"     // what the add button appends
  format="oklch"         // "hex" (default) | "oklch" | "rgb"
  alpha                  // 8-digit hex, checkerboard behind each swatch
  swatches={["#171717", "#6366f1", "#0ea5e9"]} // presets inside the picker
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
  value={palette}
  onValueChange={setPalette}
/>`,
};
