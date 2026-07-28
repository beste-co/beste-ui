import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "auth38",
  title: "Pattern Lock Unlock",
  description:
    "Full-height pattern unlock screen with a tappable 3x3 dot grid that draws connecting lines as dots are selected, plus clear and unlock controls. Perfect for app lock screens and quick re-authentication.",
  category: "Auth",
  registryDependencies: ["button"],
  fullscreen: false,
};
