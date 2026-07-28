import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-angle",
  title: "Inspector Angle",
  description:
    "Settings row for a direction: a dial you drag round, reading in degrees the way CSS does (zero up, growing clockwise), with a range input underneath carrying the keyboard and the form.",
  category: "Inspector",
  usage: `import { InspectorAngle } from "@/components/beste/component/inspector-angle";

// Uncontrolled
<InspectorAngle label="Angle" defaultValue={135} />

// Controlled, with a separate commit for expensive work
<InspectorAngle
  label="Rotation"
  value={angle}
  onValueChange={setAngle}                              // every frame of the drag
  onValueCommit={(value) => console.log("persist", value)} // on release
/>

<InspectorAngle
  label="Direction"
  icon={Compass}         // optional leading icon
  snapStep={45}          // degrees the drag snaps to while Shift is held; 15 by default
  step={1}               // what one arrow key moves
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
  value={angle}
  onValueChange={setAngle}
/>

// Values wrap, so 370 arrives as 10, and the row takes part in a form
<InspectorAngle label="Sweep" name="sweep" defaultValue={0} />`,
};
