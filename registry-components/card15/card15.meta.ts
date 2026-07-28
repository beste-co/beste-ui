import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card15",
  title: "Postcard",
  description:
    "A postcard back with a serif message, dashed stamp, postmark, and address lines for personal storytelling sections.",
  category: "Card",
  usage: `import { Card15 } from "@/components/beste/component/card15";
import { Plane } from "lucide-react";

<Card15
  message="Wish you were here. The water is unreal."
  sender="Selin"
  to="The Beste team"
  location="Alacati, TR"
/>

<Card15
  message="Six countries, one suitcase, zero regrets."
  sender="Deniz"
  stampIcon={Plane}   // stamp art (default: Palmtree); or pass stampSrc
  tone="sky"          // stamp tint: "sand" (default) | "sky" | "rose"
/>`,
};
