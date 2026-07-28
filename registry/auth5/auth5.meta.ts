import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "auth5",
  title: "Set New Password",
  description:
    "Full-height reset-password screen with new and confirm password fields (each with a show/hide toggle) and a live requirements checklist that ticks off rules as the user types. Perfect for the final step of a password reset or invite flow.",
  category: "Auth",
  registryDependencies: ["button", "input", "field"],
  fullscreen: false,
};
