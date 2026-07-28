import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "auth3",
  title: "Email Verification Code",
  description:
    "Full-height OTP verification screen with a centered icon, segmented six-digit code input, a verify button that unlocks once the code is complete, and a live resend countdown timer. Perfect for two-factor auth, magic links, and email confirmation flows.",
  category: "Auth",
  registryDependencies: ["button", "input-otp", "field"],
  fullscreen: false,
};
