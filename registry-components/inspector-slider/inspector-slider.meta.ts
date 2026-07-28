import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-slider",
  title: "Inspector Slider",
  description:
    "Compact settings row where the label and the live value sit inside the track: magnetic tick snapping, a rubber band when you overdrag, Shift for precision, Alt-click to reset, wheel and typed input, on a native range input for full accessibility.",
  category: "Inspector",
  usage: `import { InspectorSlider } from "@/components/beste/component/inspector-slider";

// Uncontrolled: the row keeps its own value and never re-renders while dragging
<InspectorSlider label="Blend" min={0} max={1} step={0.05} defaultValue={0.55} />

// Controlled, with a separate commit for expensive work
<InspectorSlider
  label="Amplitude"
  value={amplitude}
  onValueChange={setAmplitude}          // every drag frame
  onValueCommit={(value) => console.log("persist", value)} // once per gesture
  min={0.1}
  max={3}
  step={0.1}
/>

<InspectorSlider
  label="Opacity"
  min={0}
  max={100}
  step={1}
  unit="%"              // suffix on the default readout
  editable              // double-click the row (or press Enter) to type a value
  defaultValue={40}
/>

<InspectorSlider
  label="Radius"
  icon={Circle}         // optional leading lucide icon
  tone="outline"        // "muted" (default) | "outline" | "ghost"
  size="sm"             // "sm" | "default" | "lg"
  min={0}
  max={24}
  step={2}
  resetValue={8}        // restored by Alt-click
  ticks={[0, 8, 16, 24]} // true | false | count | explicit values
  formatValue={(value) => \`\${value}px\`}
  defaultValue={8}
/>

// Snapping off, plain scrolling never hijacked, disabled state
<InspectorSlider label="Speed" snap={false} wheel={false} disabled min={0} max={2} />

// Takes part in a form through its underlying range input
<InspectorSlider label="Volume" name="volume" min={0} max={1} step={0.01} />`,
};
