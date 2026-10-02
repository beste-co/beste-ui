"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconButton } from "@/components/icon-button";
import { ICON_ACTION_CLASS_SM } from "@/components/icon-action";

interface NavArrowButtonProps {
  /** Where it goes. Left out, this is the end of the run and the button dims. */
  href?: string;
  direction: "prev" | "next";
  /** Spoken name — the button shows an arrow and no text. */
  label: string;
}

// Places where the arrow keys already mean something, so the page must not take them
const KEY_OWNERS =
  'input, textarea, select, [contenteditable="true"], [role="slider"], [role="tab"], [role="radio"], [role="menuitem"], [role="option"], [role="spinbutton"], [role="textbox"], [role="combobox"], [role="dialog"], [role="menu"], [role="listbox"]';

/**
 * The previous/next arrow in a detail page header, as the library's icon-only
 * `IconButton` — the site's hugeicons copy of `button4` — on the same
 * filled surface as every other round action.
 *
 * A client component for one reason: the pages that use it are server
 * components, and an icon does not survive the boundary. Naming the icons on
 * this side of the line is the whole job — the pages pass an href and a label,
 * which are strings.
 *
 * The left and right arrow keys press it too, unless the focus is somewhere
 * that uses them itself or a dialog is open.
 */
export function NavArrowButton({ href, direction, label }: NavArrowButtonProps) {
  const icon = direction === "prev" ? ArrowLeft01Icon : ArrowRight01Icon;
  const router = useRouter();

  useEffect(() => {
    if (!href) return;
    const key = direction === "prev" ? "ArrowLeft" : "ArrowRight";
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== key || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(KEY_OWNERS)) return;
      if (document.querySelector('[role="dialog"][data-state="open"], [role="menu"][data-state="open"], [role="listbox"]')) return;
      router.push(href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [href, direction, router]);

  if (!href) {
    return (
      <span aria-hidden="true" className="pointer-events-none opacity-40">
        <IconButton label={label} icon={icon} className={ICON_ACTION_CLASS_SM} />
      </span>
    );
  }

  return (
    <IconButton asChild label={label} icon={icon} className={ICON_ACTION_CLASS_SM}>
      <Link href={href} />
    </IconButton>
  );
}
