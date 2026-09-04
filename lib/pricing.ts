/**
 * Public-build pricing: none.
 *
 * Everything in this repository is free, so the countdown and discount banners
 * the private build shows have nothing to advertise. The exported shape is kept
 * whole so the footer, the pricing page and the sale banner compile unchanged,
 * with the checkout identifiers left where they belong.
 */

export const DISCOUNTS_ENABLED = false;

/** In the past, so any date-gated promo renders as expired. */
export const COUNTDOWN_END = 0;

export const SALE_LABEL = "";

export const PRICING = {
  monthly: { original: 0, discounted: 0, discountId: "" },
  lifetime: { original: 0, discounted: 0, discountId: "" },
  team: { original: 0, discounted: 0, discountId: "" },
} as const;

export type PricingPlan = keyof typeof PRICING;

/** Always false here: the switch is off and there is nothing to discount. */
export function isSaleActive(now: number = Date.now()): boolean {
  return (
    DISCOUNTS_ENABLED &&
    now < COUNTDOWN_END &&
    Object.values(PRICING).some((plan) => plan.discounted < plan.original)
  );
}

/** Free, whichever plan is asked for. */
export function currentPrice(plan: PricingPlan, now: number = Date.now()): number {
  return isSaleActive(now) ? PRICING[plan].discounted : PRICING[plan].original;
}

/** No percentage to take off, and the guard keeps 0/0 out of the arithmetic. */
export function salePercent(plan: PricingPlan): number {
  const { original, discounted } = PRICING[plan];
  return original > 0 ? Math.floor((1 - discounted / original) * 100) : 0;
}
