import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "auth7",
  title: "Account Chooser",
  description:
    "Full-height account picker that lists saved accounts with avatars, names, and emails, plus a use-another-account row. Perfect for multi-account apps, SSO hubs, and returning-user sign-in.",
  category: "Auth",
  registryDependencies: ["avatar", "field"],
  fullscreen: false,
};
