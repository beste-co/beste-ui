/**
 * The shape a round icon action wears across the site: the library's `button4`
 * on the same filled surface the search field, the category picker and the pager
 * use, with the border taken off.
 *
 * A constant rather than a wrapper component, because the buttons that need it
 * are otherwise unalike — one toggles, one opens a menu, two are links — and the
 * only thing they should share is how they look.
 */
export const ICON_ACTION_CLASS = "size-11 border-0 bg-muted/60 hover:bg-muted";

/** The same thing where a header has to stay compact. */
export const ICON_ACTION_CLASS_SM = "size-9 border-0 bg-muted/60 hover:bg-muted";
