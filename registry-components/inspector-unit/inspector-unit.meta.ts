import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-unit",
  title: "Inspector Unit",
  description:
    "A number and the unit that gives it meaning, in one row: px, rem, a percentage, or a keyword like auto that is the whole value on its own. Each unit may bring its own range, so a percentage stops at 100 while pixels do not.",
  category: "Inspector",
  registryDependencies: ["select"],
  usage: `import { InspectorUnit } from "@/components/beste/component/inspector-unit";

// Uncontrolled
<InspectorUnit label="Width" defaultValue={{ value: 100, unit: "%" }} />

// Controlled, with a separate commit for expensive work
<InspectorUnit
  label="Max width"
  value={width}
  onValueChange={setWidth}
  onValueCommit={(value) => save(value)}
/>

// A unit that is the whole value: the number field steps aside rather than sitting
// there holding a figure that means nothing
<InspectorUnit
  label="Height"
  units={["px", "%", "vh", { value: "auto", valueless: true }]}
  value={height}
  onValueChange={setHeight}
/>

// A range per unit, since 0 to 100 reads as a percentage and 0 to 9999 does not
<InspectorUnit
  label="Offset"
  units={[
    { value: "px", min: -400, max: 400 },
    { value: "%", min: -100, max: 100 },
    { value: "rem", min: -24, max: 24, step: 0.25 },
  ]}
  value={offset}
  onValueChange={setOffset}
/>

<InspectorUnit
  label="Letter spacing"
  icon={TypeIcon}     // optional leading icon
  tone="outline"      // "muted" (default) | "outline" | "ghost"
  size="sm"           // "sm" | "default" | "lg"
  units={["em", "px"]}
  step={0.01}
  precision={3}       // decimals kept on commit
  name="tracking"     // submits as tracking and tracking-unit
  value={tracking}
  onValueChange={setTracking}
/>

// What the value turns into
const css = value.unit === "auto" ? "auto" : \`\${value.value}\${value.unit}\`;

// The arrows work the field the way they work a stepper, and Shift moves ten steps.`,
};
