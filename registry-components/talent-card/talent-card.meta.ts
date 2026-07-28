import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "talent-card",
  componentName: "TalentCard",
  title: "Talent Card",
  description:
    "A candidate/freelancer card: avatar with verified badge, star rating or new label, a location/rate split, and toggleable wishlist and invite actions that track their own state. Ideal for talent marketplaces and staffing grids.",
  category: "Dashboard",
  registryDependencies: ["button", "avatar"],
  usage: `import { TalentCard } from "@/components/beste/component/talent-card";

<TalentCard
  name="Selin Aydar"
  verified
  rating={4.6}
  reviews={18}
  location="Porto, PT"
  distance="820 miles away"
  rate="$142"
  availability="Recently active — Available"
  onWishlist={(saved) => console.log("wishlist:", saved)}
  onInvite={(invited) => console.log("invite:", invited)}
/>`,
};
