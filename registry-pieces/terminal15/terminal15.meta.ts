import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "terminal15",
  title: "Deploy Log",
  description:
    "Streaming build log where timestamped lines append every half second and older ones slide up out of view, with warnings in amber and successes in green until the deploy lands.",
  category: "Terminal",
};
