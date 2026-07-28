/**
 * Playground for `talent-card`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "The heart", does: "Toggles the shortlist and calls `onWishlist` with what it became \u2014 the card keeps the state so the page does not have to." },
    { keys: "The invite button", does: "Flips between inviting and invited, and calls `onInvite`." },
  ],
  controls: [
    { prop: "name", label: "Name", kind: "text", placeholder: "Selin Aydar" },
    { prop: "location", label: "Location", kind: "text", placeholder: "Porto, PT" },
    { prop: "distance", label: "Distance", kind: "text", placeholder: "820 miles away" },
    { prop: "rate", label: "Rate", kind: "text", placeholder: "$142" },
    { prop: "availability", label: "Availability", kind: "text", placeholder: "Available" },
    { prop: "rating", label: "Rating", kind: "stepper", min: 0, max: 5, default: 4.6, step: 0.1 },
    { prop: "reviews", label: "Reviews", kind: "stepper", min: 0, max: 999, default: 18 },
    { prop: "verified", label: "Verified", kind: "switch", default: false },
    { prop: "defaultWishlisted", label: "Shortlisted", kind: "switch", default: false },
    { prop: "defaultInvited", label: "Invited", kind: "switch", default: false },
  ],
};
