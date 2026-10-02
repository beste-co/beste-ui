import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "price-toggle",
  title: "Price Toggle",
  description:
    "A billing period switch for pricing sections: a thumb slides between Monthly and Yearly (or any periods you pass) on a soft spring, measured from each label so any length fits, and a savings badge like \"2 months free\" turns green and pops when its period is picked. It renders whatever you pass as children with the picked period, so a price-tag underneath follows it and its digits roll. Built from native radios, so arrow keys, forms and screen readers work as they do in any radio group. Three tones and three sizes.",
  category: "Price",
  cardScale: 1,
  registryComponents: ["price-tag"],
  usage: `import { PriceToggle } from "@/components/beste/component/price-toggle";
import { PriceTag } from "@/components/beste/component/price-tag";

// The price follows the switch and its digits roll
<PriceToggle defaultValue="monthly">
  {(period) =>
    period === "yearly" ? (
      <PriceTag amount={120} period="/yr" periodLabel="per year" />
    ) : (
      <PriceTag amount={12} period="/mo" periodLabel="per month" />
    )
  }
</PriceToggle>

// Your own periods, controlled
<PriceToggle
  value={period}
  onValueChange={setPeriod}
  options={[
    { value: "month", label: "Month" },
    { value: "quarter", label: "Quarter", badge: "Save 10%" },
    { value: "year", label: "Year", badge: "Save 20%" },
  ]}
  tone="outline"        // "muted" (default) | "outline" | "ghost"
  size="sm"             // "sm" | "default" | "lg"
/>`,
};
