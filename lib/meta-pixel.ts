/**
 * Public-build Meta Pixel: none.
 *
 * Same reasoning as the analytics stub: a fork has no business reporting to the
 * hosted site's ad account. The exported shape is kept so callers compile
 * unchanged, and every call is a no-op.
 */

export const isMetaPixelEnabled = false;

export const previewConsentInDev = false;

export function revokeMetaPixel() {}

export function trackMeta(
  _event: string,
  _params: Record<string, unknown> = {},
  _eventId?: string
) {}

export function metaCheckoutMetadata(): Record<string, string> {
  return {};
}

interface PendingPurchase {
  plan: string;
  value: number;
}

export function rememberPendingPurchase(_purchase: PendingPurchase) {}

export function takePendingPurchase(): PendingPurchase | null {
  return null;
}
