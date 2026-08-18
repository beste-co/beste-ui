import type { ReactNode } from "react";
import { MainProviders } from "@/components/main-providers";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <MainProviders>
      {children}
      {/* Mounted once for the whole site: the tools use it to confirm a copy
          that happens somewhere other than where the button is. */}
      <Toaster position="bottom-right" />
    </MainProviders>
  );
}
