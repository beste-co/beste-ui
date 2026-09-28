import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "loupe-compare",
  title: "Loupe Compare",
  description:
    "A before and after comparison: two pictures stacked in one frame, the top one revealed up to a divider with a round handle. Drag the divider, click anywhere to send it there on a spring, or switch to hover mode so a mouse moves it without pressing; it runs sideways or top to bottom. The reveal is a clip-path and the position is a single CSS variable, so nothing reflows and moving costs no renders. Captions on each side fade as the divider reaches them. Both pictures load before either shows, then fade in together over a soft placeholder. The frame keeps its aspect ratio, and the keyboard works it like a slider: arrows, Page Up and Page Down, Home and End.",
  category: "Loupe",
  usage: `import { LoupeCompare } from "@/components/beste/component/loupe-compare";

<LoupeCompare
  before={{ src: "/photos/raw.jpg", alt: "The stage before the lighting cue" }}
  after={{ src: "/photos/graded.jpg", alt: "The stage with the lighting cue" }}
  labels={{ before: "Raw", after: "Graded" }}
  aspectRatio="16/9"
/>

// Top to bottom, following the mouse without a press
<LoupeCompare
  before={{ src: "/photos/scan.jpg", alt: "Archive scan", className: "grayscale" }}
  after={{ src: "/photos/scan.jpg", alt: "Restored scan" }}
  orientation="vertical"
  mode="hover"
  onValueCommit={(value) => console.log("settled at", value)}
/>`,
};
