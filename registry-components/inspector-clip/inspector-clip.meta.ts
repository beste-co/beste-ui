import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-clip",
  title: "Inspector Clip",
  description:
    "The shape a box is cut to. Every thumbnail is drawn with the property it sets, so the grid is not a picture of the shapes but the shapes themselves, and a shape with a number in it brings its own slider out. Percentages throughout, so a shape survives a box that changes size.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: ["inspector-slider"],
  usage: `import { InspectorClip, clipToCss } from "@/components/beste/component/inspector-clip";

<InspectorClip label="Shape" defaultValue={{ shape: "hexagon" }} />

<InspectorClip
  label="Mask"
  value={clip}                   // { shape, amount }
  onValueChange={setClip}
  onOpenChange={(open) => console.log("editor open:", open)}
  columns={4}                    // shapes per row, five by default
  tone="outline"                 // "muted" (default) | "outline" | "ghost"
  size="sm"                      // "sm" | "default" | "lg"
/>

// Your own shapes. A function makes the shape parametric, which is what brings
// the amount slider out.
<InspectorClip
  label="Shape"
  shapes={[
    { value: "none", label: "None", css: "none" },
    { value: "arch", label: "Arch", css: "ellipse(50% 100% at 50% 100%)" },
    {
      value: "notch",
      label: "Notch",
      css: (amount) => \`inset(0 0 \${amount}% 0)\`,
      defaultAmount: 20,
      amountLabel: "Depth",
    },
  ]}
/>

<div style={{ clipPath: clipToCss(clip) }} />`,
};
