import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "error8",
  title: "404 With Redirect Countdown",
  description:
    "404 page that counts down to an automatic redirect and calls onRedirect once it reaches zero, with a cancel button that stops the timer and a manual go-now link.",
  category: "Error",
  registryDependencies: ["button"],
};
