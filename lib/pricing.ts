/**
 * Public-build pricing: none.
 *
 * Everything in this repository is free, so the countdown and discount banners
 * the private build shows have nothing to advertise. The exported shape is kept
 * so the footer and anything else reading it compiles unchanged, with the
 * checkout identifiers left where they belong.
 */

export const DISCOUNTS_ENABLED = false;

/** In the past, so any date-gated promo renders as expired. */
export const COUNTDOWN_END = 0;

export const PRICING = {
  monthly: { original: 0, discounted: 0, discountId: "" },
  lifetime: { original: 0, discounted: 0, discountId: "" },
  team: { original: 0, discounted: 0, discountId: "" },
} as const;
