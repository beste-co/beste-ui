import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "auth6",
  title: "Magic Link Sign In",
  description:
    "Full-height passwordless sign-in screen with a single email field, a send-magic-link button, a helper note, and social login providers below a divider. Perfect for passwordless and email-link authentication flows.",
  category: "Auth",
  registryDependencies: ["button", "input", "field"],
  fullscreen: false,
};
