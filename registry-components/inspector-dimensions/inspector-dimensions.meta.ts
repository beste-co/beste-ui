import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-dimensions",
  title: "Inspector Dimensions",
  description:
    "Width and height on one row, with the lock between them: while it is closed, editing one scales the other by the ratio the pair had when the lock closed. Both fields are as wide as the largest number they can hold, so typing never shifts the row.",
  category: "Inspector",
  usage: `import { InspectorDimensions } from "@/components/beste/component/inspector-dimensions";

<InspectorDimensions label="Size" defaultValue={{ width: 1280, height: 720 }} defaultLocked />

<InspectorDimensions
  label="Canvas"
  value={size}                    // { width, height }
  onValueChange={setSize}         // every accepted edit
  onValueCommit={(next) => console.log("settled on", next)}  // Enter or blur
  locked={locked}                 // controlled lock; pair it with onLockedChange
  onLockedChange={setLocked}
  min={16}
  max={4096}
  step={8}                        // arrows step by this, Shift by ten of them
  precision={0}                   // decimals kept, which matters because a locked edit divides
  suffix="px"                     // printed once, after the pair
  name="canvas"                   // fields submit as canvas-width and canvas-height
  tone="outline"                  // "muted" (default) | "outline" | "ghost"
  size="sm"                       // "sm" | "default" | "lg"
/>

// A pair whose numbers are genuinely unrelated
<InspectorDimensions label="Grid" lockable={false} defaultValue={{ width: 12, height: 6 }} suffix="" />`,
};
