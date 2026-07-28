import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "auth2",
  title: "Split-Screen Sign Up",
  description:
    "Two-column registration screen pairing a sign-up form (social providers, name, email, password with show/hide, terms checkbox) with a full-bleed image showcase and customer testimonial. Includes a left/right image position toggle.",
  category: "Auth",
  registryDependencies: ["button", "input", "field", "checkbox", "avatar"],
  fullscreen: false,
};
