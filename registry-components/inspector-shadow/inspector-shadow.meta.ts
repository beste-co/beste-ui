import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-shadow",
  title: "Inspector Shadow",
  description:
    "Settings row for a box shadow: the row shows the shadow itself, and opens an editor holding a larger preview with offset, blur, spread and colour under it, each one a row of the family.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: ["inspector-slider", "inspector-color"],
  usage: `import { InspectorShadow } from "@/components/beste/component/inspector-shadow";

// Uncontrolled. The value is the pieces CSS takes, so the shadow itself is
// \`\${x}px \${y}px \${blur}px \${spread}px \${color}\`.
<InspectorShadow label="Shadow" defaultValue={{ x: 0, y: 3, blur: 12, spread: -2, color: "#0f172a33" }} />

// Controlled, with a separate commit for expensive work
<InspectorShadow
  label="Card shadow"
  value={shadow}
  onValueChange={setShadow}                             // every frame of a drag
  onValueCommit={(value) => console.log("persist", value)} // on release
/>

// There is no opacity control on purpose: the colour carries its own alpha, and
// two ways to set one number always drift apart.
<InspectorShadow
  label="Glow"
  icon={Sun}             // optional leading icon
  maxOffset={80}         // how far the offsets reach, either way; 40 by default
  maxBlur={120}
  maxSpread={40}
  allowInset            // offers the inset/outset toggle
  format="oklch"        // notation the colour is written back in
  tone="outline"        // "muted" (default) | "outline" | "ghost"
  size="sm"             // "sm" | "default" | "lg"
  value={shadow}
  onValueChange={setShadow}
/>`,
};
