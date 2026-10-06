import { trackMeta } from "@/lib/meta-pixel";

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * One call per user action, reported to both GA4 and the Meta Pixel.
 *
 * GA4 gets its recommended event names where one exists, so the built-in
 * reports work; Meta gets its standard events, so campaigns can optimize on
 * them. The rest go out as custom events under the same name on both sides.
 */

export interface TrackedItem {
  kind: string;
  name: string;
}

interface EventParams {
  view_item: TrackedItem;
  search: { term: string };
  copy_install_command: undefined;
  copy_code: undefined;
  pro_gate_view: undefined;
  pro_upgrade_click: undefined;
  add_to_wishlist: { name: string };
  sign_up: undefined;
  begin_checkout: { plan: string; value: number };
  purchase: { plan: string; value: number; transactionId: string };
}

export type TrackedEvent = keyof EventParams;

const CURRENCY = "USD";

/** The block, piece or component a detail URL is about. */
export function itemFromPath(pathname: string): TrackedItem | null {
  const match = pathname.match(/^\/(block|piece|component)\/(?:r-base\/)?([^/]+)$/);
  return match?.[1] && match[2] ? { kind: match[1], name: match[2] } : null;
}

function gtag(event: string, params: Record<string, unknown>) {
  if (typeof window.gtag === "function") window.gtag("event", event, params);
}

const gaItem = (item: TrackedItem) => ({
  item_id: item.name,
  item_name: item.name,
  item_category: item.kind,
});

const metaItem = (item: TrackedItem) => ({
  content_ids: [item.name],
  content_name: item.name,
  content_category: item.kind,
});

const planItem = (plan: string) => ({ item_id: plan, item_name: `Pro ${plan}` });

type Args<E extends TrackedEvent> = EventParams[E] extends undefined
  ? [event: E]
  : [event: E, params: EventParams[E]];

export function trackEvent<E extends TrackedEvent>(...args: Args<E>) {
  if (typeof window === "undefined") return;
  const [event, params] = args as [TrackedEvent, EventParams[TrackedEvent]];
  // Events fired from a detail page carry the item they happened on.
  const here = itemFromPath(window.location.pathname);

  switch (event) {
    case "view_item": {
      const item = params as TrackedItem;
      gtag("view_item", { items: [gaItem(item)] });
      trackMeta("ViewContent", metaItem(item));
      return;
    }
    case "search": {
      const { term } = params as EventParams["search"];
      gtag("search", { search_term: term });
      trackMeta("Search", { search_string: term });
      return;
    }
    case "add_to_wishlist": {
      const item = { kind: "favorite", name: (params as EventParams["add_to_wishlist"]).name };
      gtag("add_to_wishlist", { items: [gaItem(item)] });
      trackMeta("AddToWishlist", metaItem(item));
      return;
    }
    case "sign_up":
      gtag("sign_up", {});
      trackMeta("CompleteRegistration");
      return;
    case "begin_checkout": {
      const { plan, value } = params as EventParams["begin_checkout"];
      gtag("begin_checkout", { value, currency: CURRENCY, items: [planItem(plan)] });
      trackMeta("InitiateCheckout", { value, currency: CURRENCY, content_name: plan });
      return;
    }
    case "purchase": {
      const { plan, value, transactionId } = params as EventParams["purchase"];
      gtag("purchase", {
        transaction_id: transactionId,
        value,
        currency: CURRENCY,
        items: [{ ...planItem(plan), price: value, quantity: 1 }],
      });
      trackMeta("Purchase", { value, currency: CURRENCY, content_name: plan }, transactionId);
      return;
    }
    default: {
      gtag(event, here ? { item_id: here.name, item_category: here.kind } : {});
      trackMeta(event, here ? metaItem(here) : {});
    }
  }
}
