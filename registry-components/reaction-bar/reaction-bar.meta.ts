import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "reaction-bar",
  title: "Reaction Bar",
  description:
    "Emoji reaction pills with counts for comments, posts and messages: pressing a pill adds or removes your own reaction, with a small burst of particles as it lands and the count rolling up or down from the side it moves toward. Hovering or focusing a pill names who reacted (\"You, Nina Simone and 9 others\"), and a \"+\" button opens a compact emoji grid for a new reaction, which arrives as a pill of its own. Each pill is a real toggle button with `aria-pressed` and a spoken label, and it works controlled or uncontrolled.",
  category: "Reaction",
  registryDependencies: ["popover"],
  usage: `import { ReactionBar } from "@/components/beste/component/reaction-bar";

<ReactionBar
  reactions={[
    { emoji: "🔥", count: 12, by: ["Nina Simone", "Miles Davis"] },
    { emoji: "❤️", count: 7 },
  ]}
  defaultValue={["❤️"]}
/>

// Controlled, saving each change
<ReactionBar
  reactions={reactions}
  value={mine}
  onValueChange={(next) => console.log("Save reactions", next)}
  choices={["👍", "❤️", "🎧"]}   // what the "+" button offers; [] hides it
  maxNames={2}                   // names in the tooltip before "and N others"
  tone="outline"                 // "muted" | "outline" | "ghost"
  size="sm"                      // "sm" | "default" | "lg"
/>`,
};
