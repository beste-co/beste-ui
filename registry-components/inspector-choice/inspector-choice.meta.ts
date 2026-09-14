import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-choice",
  title: "Inspector Choice",
  description:
    "A short list of named choices with one of them on: a plan, a studio look, a delivery option. Each row carries a label, a line saying what picking it means, and room for a state on the right, so a list of options worth reading does not have to hide in a menu.",
  category: "Inspector",
  usage: `import { InspectorChoice } from "@/components/beste/component/inspector-choice";

// Controlled: the row that matches value is on, the rest answer hover
<InspectorChoice
  aria-label="Plan"
  value={plan}
  onValueChange={(next) => console.log("plan", next)}
  options={[
    { value: "free", label: "Free", description: "One site, community support" },
    { value: "pro", label: "Pro", description: "Unlimited sites, custom domains", badge: "Current" },
    { value: "agency", label: "Agency", description: "Twenty five sites and invites" },
  ]}
/>

// Two columns when the descriptions are a few words, not sentences
<InspectorChoice
  aria-label="Delivery"
  defaultValue="standard"
  columns={2}
  tone="ghost"          // "muted" (default) | "outline" | "ghost"
  size="sm"             // "sm" | "default" | "lg"
  options={[
    { value: "standard", label: "Standard", hint: "Free" },
    { value: "express", label: "Express", hint: "$12" },
  ]}
/>`,
};
