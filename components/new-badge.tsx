"use client";

import { useEffect, useState } from "react";

/** How long a card wears the badge, from the day the thing shipped. */
const NEW_FOR_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * `isNew(name)` for a grid, from the ship dates a server component handed it
 * (`recentBlockDates()` and friends).
 *
 * The clock is read after mount rather than during render: these pages are
 * static, so the server's clock is the clock of whenever the page was built, and
 * a badge decided there would still be on the card a week later. Nothing is new
 * until the effect runs, which is also what keeps the first client render
 * identical to the server's.
 */
export function useIsNew(addedDates?: Readonly<Record<string, string>>) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  return (name: string): boolean => {
    const date = addedDates?.[name];
    if (!date || now === null) return false;
    return now - Date.parse(date) < NEW_FOR_MS;
  };
}

/**
 * The mark itself, for the corner of a card. `count` turns it into a tally
 * ("4 NEW") for a card that stands for several things rather than one.
 *
 * The brand orange as a literal, like every other place it is used (the
 * wordmark, the avatar, the unlock modal): it is a fixed brand colour, not the
 * theme's `primary`, which a reader can repaint from the theme picker. Outlined
 * rather than filled, and on a solid surface rather than a transparent one: the
 * badge sits over someone else's design, and orange on whatever that design put
 * underneath is not a colour anyone chose.
 */
export function NewBadge({ count }: { count?: number }) {
  return (
    <span className="rounded-full border border-[#FF7322] bg-background px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#FF7322] tabular-nums">
      {count === undefined ? "NEW" : `${count} NEW`}
    </span>
  );
}
