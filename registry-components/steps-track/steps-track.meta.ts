import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "steps-track",
  title: "Steps Track",
  description:
    "Multi-step progress as an ordered list: a numbered marker per step, a title and an optional description, laid out as a row or a column. As `current` advances, the line between the markers fills segment by segment on a spring and each finished number turns into a check that draws itself in; stepping back empties it the other way. Steps can also be marked as needing attention or skipped. Completed steps (or every step) can be made pressable to jump back, the current one carries `aria-current=\"step\"`, and every state is spelled out for screen readers.",
  category: "Steps",
  cardScale: 0.6,
  usage: `import { StepsTrack } from "@/components/beste/component/steps-track";

<StepsTrack
  steps={[
    { title: "Upload stems", description: "WAV or AIFF" },
    { title: "Set the mix" },
    { title: "Master" },
    { title: "Release" },
  ]}
  current={1}
/>

<StepsTrack
  steps={steps}
  current={step}
  orientation="vertical"            // a column with the text beside each marker
  onStepClick={(index) => setStep(index)}
  clickable="completed"             // "completed" | "all" | "none"
  tone="outline"                    // "muted" | "outline" | "ghost"
  size="lg"                         // "sm" | "default" | "lg"
/>

// Per-step overrides
<StepsTrack steps={[{ title: "Payment", status: "error" }, { title: "Survey", status: "skipped" }]} current={2} />`,
};
