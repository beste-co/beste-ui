import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "stage-card",
  title: "Stage Card",
  description:
    "A rounded feature card on a stone tint or a gradient: a piece up top or a photograph filling it with white copy over a dark fade, a quiet label, a sentence and an optional ticked list at the foot. Without media it becomes a short tile with an icon, stacked or beside the copy, and an optional arrow link.",
  category: "Card",
  registryComponents: ["stage-panel"],
  dependencies: [],
  usage: `import { StageCard } from "@/components/beste/component/stage-card";
import { Store } from "lucide-react";

<StageCard
  size="lg"
  backdrop="mist"
  media={<div />}                      // any piece
  label="More than 50 languages"
  description="Each language gets its own URL and hreflang tags."
/>

<StageCard icon={Store} label="Small businesses" description="Change a price yourself." link={{ label: "Read the page", href: "/solutions" }} />
<StageCard layout="inline" size="sm" icon={Store} label="Edit in a side panel" description="The page stays next to it." />`,
};
