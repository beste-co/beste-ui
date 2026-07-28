import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-select",
  title: "Inspector Select",
  description:
    "Settings row that pairs a label with its current choice inside one pill, opening a width-matched dropdown below: option icons, colour swatches, descriptions and grouped sections, on top of the accessible shadcn select.",
  category: "Inspector",
  registryDependencies: ["select"],
  usage: `import { InspectorSelect } from "@/components/beste/component/inspector-select";

// Plain strings are enough for a simple list
<InspectorSelect label="Easing" options={["linear", "ease-in", "ease-out"]} defaultValue="ease-out" />

// Controlled, with a commit-shaped handler
<InspectorSelect
  label="Blend mode"
  value={blendMode}
  onValueChange={setBlendMode}
  onOpenChange={(open) => console.log("menu open:", open)}
  options={[
    { value: "normal", label: "Normal" },
    // Consecutive options sharing a group become one section, so the order
    // you write is the order that renders.
    { value: "multiply", label: "Multiply", group: "Darken", description: "Keeps the darker pixels" },
    { value: "screen", label: "Screen", group: "Lighten" },
    { value: "hue", label: "Hue", group: "Component", disabled: true },
  ]}
/>

// Icons and colour swatches, per option
<InspectorSelect
  label="Palette"
  icon={Palette}                 // row icon, before the label
  defaultValue="sunset"
  options={[
    { value: "sunset", label: "Sunset", swatch: "#f97316" },
    { value: "ocean", label: "Ocean", swatch: "#0ea5e9" },
  ]}
/>

<InspectorSelect
  label="Font"
  tone="outline"                 // "muted" (default) | "outline" | "ghost"
  size="sm"                      // "sm" | "default" | "lg"
  menuWidth="auto"               // "trigger" (default) matches the row width
  placeholder="Inherit"          // shown until something is selected
  emptyMessage="No fonts found"
  options={fonts}
/>

// Takes part in a form through the underlying select
<InspectorSelect label="Region" name="region" options={["EU", "US", "APAC"]} disabled={isSaving} />`,
};
