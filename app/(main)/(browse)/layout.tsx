import type { ReactNode } from "react";

interface BrowseLayoutProps {
  children: ReactNode;
}

export default function BrowseLayout({ children }: BrowseLayoutProps) {
  return (
    /*
      Vertical rhythm only. The width used to live here, which meant nothing under
      this layout could ever be wider than the column — and one thing on the home
      page, the closing CTA with its marquee, is only itself at full bleed. Each page
      now draws its own column, and can step out of it.
    */
    <div className="w-full py-12 md:py-16">{children}</div>
  );
}
