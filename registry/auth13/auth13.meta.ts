import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "auth13",
  title: "Centered Sign Up Card",
  description:
    "Full-height centered registration card with social providers, name, email, and password fields (with show/hide), a terms checkbox, and a sign-in link. Perfect for SaaS sign-up pages that don't need a split layout.",
  category: "Auth",
  registryDependencies: ["button", "input", "field", "checkbox"],
  fullscreen: false,
};
