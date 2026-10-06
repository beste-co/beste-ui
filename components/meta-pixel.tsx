"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CONSENT_EVENT, hasConsent } from "@/lib/consent";
import { revokeMetaPixel, trackMeta } from "@/lib/meta-pixel";

export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // biome-ignore lint/correctness/useExhaustiveDependencies: a query change is a page view too.
  useEffect(() => {
    // Embeds run inside other people's pages; they are not visits to this site.
    if (pathname.startsWith("/embed")) return;

    trackMeta("PageView");
  }, [pathname, searchParams]);

  // The visit that gave consent is counted from the moment it is given.
  useEffect(() => {
    const onConsent = () => (hasConsent() ? trackMeta("PageView") : revokeMetaPixel());
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  return null;
}
