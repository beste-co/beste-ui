import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text15",
  title: "Running Line",
  description:
    "A single line of text that runs across its container without end, fading at both edges and pausing under the pointer. Small caps for announcements, tracked serif for statements.",
  category: "Text",
  usage: `import { Text15 } from "@/components/beste/component/text15";

<Text15
  text="Therapy and coaching, in the room or online"
  separator="·"
  duration={28}          // seconds per pass
  direction="left"       // or "right"
  className="text-sm uppercase tracking-[0.25em] text-muted-foreground"
/>`,
};
