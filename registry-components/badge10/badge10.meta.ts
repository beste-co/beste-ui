import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge10",
  title: "Rotating Text Seal",
  description:
    "A rotating circular text badge with a center icon for editorial seals and open for work stamps.",
  category: "Badge",
  usage: `import { Badge10 } from "@/components/beste/component/badge10";
import { Sparkle } from "lucide-react";

// End the text with a separator so the loop reads cleanly.
<Badge10 text="Open for work • Available now • " size={120} />

<Badge10
  text="Award winning studio • Est. 2019 • "
  icon={Sparkle}     // center icon (default: Asterisk)
  tone="muted"       // "foreground" (default) | "muted" | "primary"
  duration={20}      // seconds per rotation
  size={140}         // diameter in px
/>`,
};
