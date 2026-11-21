import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "steps-ruled",
  title: "Ruled Steps",
  description:
    "An ordered list of short points between hairline rules: a serif numeral, in roman or plain figures, beside a title and a line of detail. A large size sets bigger figures and roomier rows for process steps. Rules and quiet text take the surface's text color, so the same list sits on a light ground or a deep band.",
  category: "Steps",
  dependencies: [],
  usage: `import { StepsRuled } from "@/components/beste/component/steps-ruled";

<StepsRuled
  items={[
    { title: "Time to talk", description: "First visits are 45 minutes." },
    { title: "Clear plans and prices", description: "A written quote before anything starts." },
  ]}
  numbering="roman"   // "roman" (default) | "decimal" | "none"
  size="default"      // "default" | "lg"
  markerTone="primary" // "primary" | "secondary" | "current"
/>`,
};
