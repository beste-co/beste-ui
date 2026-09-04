import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text17",
  title: "Rolling Digits",
  description:
    "A number whose digits roll like an odometer, each column sliding to its new figure a beat after the last, whenever the value changes. For prices that switch with a toggle, years, and live counters that climb on their own.",
  category: "Text",
  dependencies: ["framer-motion"],
  usage: `import { Text17 } from "@/components/beste/component/text17";
import { useState } from "react";

const [season, setSeason] = useState(false);

<Text17 value={season ? 62 : 70} prefix="$" className="font-serif text-6xl" />

<Text17 value={2026} grouping={false} duration={1} />

// Or let it climb on its own: one every second, for a live counter
<Text17 value={1240} suffix="+" tick={1} />`,
};
