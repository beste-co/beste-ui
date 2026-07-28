import type { ReactNode } from "react";
import { MainProviders } from "@/components/main-providers";

export default function MainLayout({ children }: { children: ReactNode }) {
  return <MainProviders>{children}</MainProviders>;
}
