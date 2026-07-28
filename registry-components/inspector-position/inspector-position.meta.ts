import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-position",
  title: "Inspector Position",
  description:
    "Settings row for a point on a surface: the row names the nine spots CSS names and shows the rest as two percentages, and opens a square pad the point is dragged around, with the thirds drawn on it and a pull towards them.",
  category: "Inspector",
  registryDependencies: ["popover"],
  usage: `import { InspectorPosition } from "@/components/beste/component/inspector-position";

// Uncontrolled. The value is two percentages from the top left corner.
<InspectorPosition label="Focal Point" defaultValue={{ x: 50, y: 30 }} />

// Controlled, with a separate commit for expensive work
<InspectorPosition
  label="Focal Point"
  value={point}
  onValueChange={setPoint}
  onValueCommit={(value) => save(value)}
/>

// Pass the picture and the pad stops being a diagram of the surface
<InspectorPosition
  label="Focal Point"
  preview={\`url(\${image})\`}
  value={point}
  onValueChange={setPoint}
/>

<InspectorPosition
  label="Origin"
  icon={CrosshairIcon}   // optional leading icon
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
  snap={false}           // stop pulling towards the thirds
  step={5}               // percent a key press moves; Shift moves ten of them
  name="origin"          // submits as origin-x and origin-y
  value={point}
  onValueChange={setPoint}
/>

// What the value turns into
<div style={{ objectPosition: \`\${point.x}% \${point.y}%\` }} />
<div style={{ backgroundPosition: \`\${point.x}% \${point.y}%\` }} />
<div style={{ transformOrigin: \`\${point.x}% \${point.y}%\` }} />

// A radial gradient's centre, which is the one thing inspector-gradient cannot say
const background = \`radial-gradient(circle at \${point.x}% \${point.y}%, #6366f1, #0ea5e9)\`;`,
};
