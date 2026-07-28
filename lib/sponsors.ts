import type { DocsSponsor } from "@/components/docs-side-rail";

/**
 * Who is on the rail.
 *
 * Empty on purpose: an invented sponsor is a lie printed next to real
 * documentation, and a placeholder logo reads as one until someone checks. While
 * this list is empty the rail shows the invitation instead, which is honest and is
 * also the thing that sells the slot.
 */
export const SPONSORS: DocsSponsor[] = [];

/** Where a slot is bought. Set it to null to drop the invitation entirely. */
export const SPONSOR_HREF: string | null = "mailto:hello@beste.co?subject=Sponsoring%20beste.co";
