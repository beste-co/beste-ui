/**
 * Playground for `nav-tabs`: the indicator, the activation and the strip.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move into the strip onto the current tab, then on into its panel." },
    { keys: "Left / Right", does: "Move to the previous or next tab, wrapping at the ends and skipping disabled ones." },
    { keys: "Home / End", does: "Move to the first or last tab." },
    { keys: "Enter / Space", does: "Select the focused tab when activation is manual." },
  ],
  controls: [
    { prop: "variant", label: "Variant", kind: "segmented", options: ["underline", "pill", "segment"], default: "underline", group: "Tabs" },
    { prop: "activation", label: "Activation", kind: "segmented", options: ["automatic", "manual"], default: "automatic", group: "Tabs" },
    { prop: "keepMounted", label: "Keep panels mounted", kind: "switch", default: false, group: "Tabs" },
    ...SURFACE_CONTROLS,
  ],
};
