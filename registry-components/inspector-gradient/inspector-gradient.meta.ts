import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-gradient",
  title: "Inspector Gradient",
  description:
    "Settings row for a gradient: the row shows a strip of it, and opens an editor with draggable stops over the ramp, so one colour can hold a wider share than the next. The kind, the direction and the selected stop's colour and offset sit under it as rows of the family.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: [
    "inspector-segmented",
    "inspector-angle",
    "inspector-color",
    "inspector-slider",
  ],
  usage: `import { InspectorGradient } from "@/components/beste/component/inspector-gradient";

// Bare colours are spaced evenly, which keeps the simple case simple
<InspectorGradient label="Gradient" defaultValue={{ kind: "linear", angle: 135, stops: ["#fb7185", "#8b5cf6"] }} />

// Give a stop a position and it holds that share: here the first colour keeps the
// opening third to itself, and the last two split what is left. Drag the handles
// over the ramp in the editor to do the same by hand.
<InspectorGradient
  label="Background"
  defaultValue={{
    stops: [
      { color: "#fdba74", position: 0 },
      { color: "#fb7185", position: 40 },
      { color: "#8b5cf6", position: 100 },
    ],
  }}
/>

// Stops are written in the order given and never sorted, so a stop placed before
// the one ahead of it stays a hard edge, which is how a stripe is made.
<InspectorGradient
  label="Stripe"
  kinds={["linear"]}
  defaultValue={{ angle: 90, stops: [{ color: "#171717", position: 50 }, { color: "#e5e5e5", position: 50 }] }}
/>

// Controlled, with a separate commit for expensive work
<InspectorGradient
  label="Background"
  value={gradient}
  onValueChange={setGradient}                           // every frame of a drag
  onValueCommit={(value) => console.log("persist", value)} // on release, add, remove
/>

// One kind is a setting rather than a choice, so the segmented row drops away.
// A radial gradient has no direction either, so the dial goes with it.
<InspectorGradient label="Overlay" kinds={["linear"]} value={overlay} onValueChange={setOverlay} />

<InspectorGradient
  label="Palette"
  icon={Blend}           // optional leading icon
  minStops={2}
  maxStops={7}       // 7 by default, as the full gradient picker allowed
  format="oklch"         // notation the stops are written back in
  alpha                  // stops carry an alpha channel
  swatches={["#171717", "#fb7185", "#8b5cf6"]} // presets inside each stop's picker
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
  value={gradient}
  onValueChange={setGradient}
/>`,
};
