import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-transition",
  title: "Inspector Transition",
  description:
    "How long a change takes, when it starts, and the shape of it, in one row instead of three that drift apart. The editor runs the real transition on a loop rather than drawing its curve, since what a reader needs to know is whether 300ms feels slow.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: ["inspector-select", "inspector-slider"],
  usage: `import {
  InspectorTransition,
  transitionToCss,
} from "@/components/beste/component/inspector-transition";

<InspectorTransition
  label="Transition"
  defaultValue={{ duration: 300, delay: 0, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }}
/>

<InspectorTransition
  label="Hover"
  value={motion}                 // { duration, delay, easing }
  onValueChange={setMotion}
  onOpenChange={(open) => console.log("editor open:", open)}
  easings={["linear", { value: "ease-out", label: "Ease out" }]}
  maxDuration={1000}             // ceiling for both times, 2000 by default
  step={50}                      // step for both times, 10 by default
  tone="outline"                 // "muted" (default) | "outline" | "ghost"
  size="sm"                      // "sm" | "default" | "lg"
/>

// The shorthand, in the order that gets written backwards by hand
<div style={{ transition: transitionToCss(motion, "opacity") }} />

// For drawing a curve rather than picking one, reach for inspector-easing.`,
};
