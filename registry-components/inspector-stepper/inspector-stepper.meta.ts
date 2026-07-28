import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-stepper",
  title: "Inspector Stepper",
  description:
    "Settings row for a bounded number: minus and plus either side of a typeable value, with hold-to-repeat, Shift for coarse steps and full keyboard stepping.",
  category: "Inspector",
  usage: `import { InspectorStepper } from "@/components/beste/component/inspector-stepper";

// Uncontrolled
<InspectorStepper label="Columns" min={1} max={6} defaultValue={3} />

// Controlled, with a separate commit for expensive work
<InspectorStepper
  label="Repeat"
  value={repeat}
  onValueChange={setRepeat}                             // every step
  onValueCommit={(value) => console.log("persist", value)} // button or key release
  min={1}
  max={20}
/>

// Fractional steps set the decimals shown, and a unit can trail the number
<InspectorStepper label="Duration" min={0} max={5} step={0.25} suffix="s" defaultValue={1.5} />
<InspectorStepper label="Offset" min={-40} max={40} suffix="px" defaultValue={0} />

<InspectorStepper
  label="Gap"
  icon={Ruler}           // optional leading icon
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
  min={0}
  max={64}
  step={4}
  value={gap}
  onValueChange={setGap}
/>

// Hold either button to keep stepping; Shift multiplies the step by ten, and the
// value takes arrows, Page Up/Down, Home/End and typed input.
<InspectorStepper label="Delay" name="delay" min={0} max={1000} step={50} suffix="ms" />`,
};
