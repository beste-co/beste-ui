/**
 * Playground for `inspector-note`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  // Its own tones, and no `disabled`: a note is prose between rows, not a control.
  props: { children: "Applies to every breakpoint.", tone: "warning" },
  controls: [
    { prop: "children", label: "Text", kind: "text", placeholder: "Applies to every page" },
    {
      prop: "tone",
      label: "Tone",
      kind: "select",
      options: ["muted", "info", "warning", "danger"],
      default: "muted",
      group: "Surface",
    },
    {
      prop: "size",
      label: "Size",
      kind: "select",
      options: ["sm", "default", "lg"],
      default: "default",
      group: "Surface",
    },
    { prop: "hideIcon", label: "Hide mark", kind: "switch", default: false, group: "Surface" },
  ],
};
