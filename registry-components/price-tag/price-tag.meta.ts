import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "price-tag",
  title: "Price Tag",
  description:
    "A price, formatted by the locale's own rules: cents hide on whole amounts, the currency symbol and cents can sit smaller and raised, and a short period follows the number. When the amount changes, as on a monthly to yearly switch, each digit rolls the way the price moved. An optional old price is struck through beside a computed \"Save 20%\" chip, a zero reads as \"Free\", and the whole price is spelled out for screen readers. Three tones for the chip and three sizes.",
  category: "Price",
  usage: `import { PriceTag } from "@/components/beste/component/price-tag";

<PriceTag amount={29} period="/mo" periodLabel="per month" />

// A yearly switch: the digits roll to the new amount
<PriceTag amount={yearly ? 290 : 29} period={yearly ? "/yr" : "/mo"} />

<PriceTag
  amount={24}
  compareAt={30}        // struck through, with a "Save 20%" chip
  currency="EUR"
  locale="de-DE"
  symbol="raised"       // "inline" (default) | "raised"
  cents="raised"
  tone="outline"        // "muted" (default) | "outline" | "ghost"
  size="lg"             // "sm" | "default" | "lg"
/>`,
};
