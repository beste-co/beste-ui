import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "kbd-sheet",
  title: "Keyboard Shortcut Sheet",
  description:
    "A keyboard shortcut sheet: groups of shortcuts drawn with kbd-combo caps, which show Command on Apple platforms and Control elsewhere, laid out in balanced columns so groups of different lengths never leave holes. A search field filters by label, by the keys as written and by their names on either platform, highlighting the match. It sits in place on a docs page, or opens as a dialog from anywhere with the question mark key, which is ignored while the reader types. Sequences like g then h, three tones and three sizes.",
  category: "Keyboard",
  dependencies: ["lucide-react"],
  registryDependencies: ["dialog"],
  registryComponents: ["kbd-combo"],
  usage: `import { KbdSheet } from "@/components/beste/component/kbd-sheet";

const groups = [
  {
    title: "Playback",
    shortcuts: [
      { keys: "space", label: "Play or pause" },
      { keys: "mod+right", label: "Next track" },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [{ keys: ["g", "h"], label: "Go home", sequence: true }],
  },
];

// A dialog that opens with "?" from anywhere in the app
<KbdSheet groups={groups} />

// In place on a docs page
<KbdSheet groups={groups} inline tone="outline" />`,
};
