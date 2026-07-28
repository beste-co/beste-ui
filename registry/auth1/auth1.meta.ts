import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "auth1",
  title: "Centered Sign In Card",
  description:
    "Full-height centered sign-in screen with social login providers, email and password fields, a show/hide password toggle, remember-me checkbox, and forgot-password link. Perfect for SaaS apps, dashboards, and member portals.",
  category: "Auth",
  registryDependencies: ["button", "input", "field", "checkbox"],
  fullscreen: false,
};
