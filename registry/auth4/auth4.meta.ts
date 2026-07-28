import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "auth4",
  title: "Forgot Password Request",
  description:
    "Full-height password recovery screen with a centered icon, single email field built on the shadcn Field primitives, a send-reset-link button, and a back-to-sign-in link. Perfect for the first step of any password reset flow.",
  category: "Auth",
  registryDependencies: ["button", "input", "field"],
  fullscreen: false,
};
