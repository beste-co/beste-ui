"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button23 } from "@/components/beste/component/button23";
import {
  CONSENT_SETTINGS_HREF,
  type Consent,
  getStoredConsent,
  needsConsent,
  setConsent,
} from "@/lib/consent";

export function CookieConsent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (needsConsent() && getStoredConsent() === null) setOpen(true);

    // Any "Cookie settings" link on the page reopens the panel.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.(`a[href$="${CONSENT_SETTINGS_HREF}"]`);
      if (!link) return;
      event.preventDefault();
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!open || pathname.startsWith("/embed")) return null;

  const choose = (consent: Consent) => {
    setConsent(consent);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-4 rounded-2xl bg-background p-5 text-foreground shadow-[0_20px_60px_-15px] shadow-foreground/25 ring-1 ring-foreground/10 sm:inset-x-auto sm:left-4 sm:max-w-sm"
    >
      <div>
        <p className="text-base font-medium text-foreground">Cookies</p>
        <p className="mt-1.5 text-sm text-foreground/70">
          We use cookies to understand how the site is used and to improve it.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button23
          size="sm"
          tone="outline"
          label="Decline"
          onClick={() => choose("denied")}
          className="w-full cursor-pointer justify-between"
        />
        <Button23
          size="sm"
          tone="dark"
          label="Accept"
          onClick={() => choose("granted")}
          className="w-full cursor-pointer justify-between"
        />
      </div>
    </div>
  );
}
