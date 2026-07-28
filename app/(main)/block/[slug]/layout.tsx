// Server layout (PreviewFontProvider is itself a client component; children
// pass through). Keeping the layout server-side lets notFound() in the page
// set a real 404 status instead of flushing a 200 shell first.
import type { ReactNode } from "react";
import { PreviewFontProvider } from "@/components/fonts/preview-font-provider";

export default function BlockLayout({ children }: { children: ReactNode }) {
  return <PreviewFontProvider>{children}</PreviewFontProvider>;
}
