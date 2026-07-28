"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { IconButton } from "@/components/icon-button";
import { ICON_ACTION_CLASS } from "@/components/icon-action";

interface NavArrowButtonProps {
  /** Where it goes. Left out, this is the end of the run and the button dims. */
  href?: string;
  direction: "prev" | "next";
  /** Spoken name — the button shows an arrow and no text. */
  label: string;
}

/**
 * The previous/next arrow in a detail page header, as the library's icon-only
 * `IconButton` — the site's hugeicons copy of `button4` — on the same
 * filled surface as every other round action.
 *
 * A client component for one reason: the pages that use it are server
 * components, and an icon does not survive the boundary. Naming the icons on
 * this side of the line is the whole job — the pages pass an href and a label,
 * which are strings.
 */
export function NavArrowButton({ href, direction, label }: NavArrowButtonProps) {
  const icon = direction === "prev" ? ArrowLeft01Icon : ArrowRight01Icon;

  if (!href) {
    return (
      <span aria-hidden="true" className="pointer-events-none opacity-40">
        <IconButton label={label} icon={icon} className={ICON_ACTION_CLASS} />
      </span>
    );
  }

  return (
    <IconButton asChild label={label} icon={icon} className={ICON_ACTION_CLASS}>
      <Link href={href} />
    </IconButton>
  );
}
