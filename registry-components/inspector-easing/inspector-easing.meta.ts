import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-easing",
  title: "Inspector Easing",
  description:
    "Settings row for a cubic-bezier: the row names the preset and draws the curve small, and opens an editor with the two control points draggable, room above and below the run for an overshoot, and a strip that runs the motion so the choice can be watched rather than read.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: ["inspector-select"],
  usage: `import { InspectorEasing } from "@/components/beste/component/inspector-easing";

// Uncontrolled. The value is the four numbers cubic-bezier() takes, in its order.
<InspectorEasing label="Easing" defaultValue={[0.34, 1.56, 0.64, 1]} />

// Controlled. The value is a four-tuple, so say so on the state: a plain
// \`useState([0.25, 0.1, 0.25, 1])\` widens to number[] and will not fit.
const [easing, setEasing] = React.useState<[number, number, number, number]>([0.25, 0.1, 0.25, 1]);

<InspectorEasing
  label="Easing"
  value={easing}
  onValueChange={setEasing}
  onValueCommit={(value) => save(value)}
/>

<InspectorEasing
  label="Curve"
  icon={ActivityIcon}   // optional leading icon
  tone="outline"        // "muted" (default) | "outline" | "ghost"
  size="sm"             // "sm" | "default" | "lg"
  hidePreview           // drop the strip that runs the motion
  presets={[            // pass an empty list to leave only the curve
    { label: "Snap", value: [0.2, 0, 0, 1] },
    { label: "Glide", value: [0.16, 1, 0.3, 1] },
  ]}
  value={easing}
  onValueChange={setEasing}
/>

// What the value turns into
<div style={{ transitionTimingFunction: \`cubic-bezier(\${easing.join(", ")})\` }} />

// The same four numbers reach a Web Animations call
element.animate(frames, { duration: 400, easing: \`cubic-bezier(\${easing.join(", ")})\` });`,
};
