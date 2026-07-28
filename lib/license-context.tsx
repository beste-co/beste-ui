"use client";

import type { ReactNode } from "react";

/**
 * Public-build license context: no paid tier, so nothing is ever unlocked and
 * nothing is ever locked either. Every block in this repository is free.
 */

interface LicenseContextType {
  hasPro: boolean;
  plan: string | null;
  expiresAt: string | null;
  licenseKey: string | null;
  loading: boolean;
  refreshLicense: () => Promise<void>;
}

const NO_LICENSE: LicenseContextType = {
  hasPro: false,
  plan: null,
  expiresAt: null,
  licenseKey: null,
  loading: false,
  refreshLicense: async () => {},
};

export function LicenseProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useLicense(): LicenseContextType {
  return NO_LICENSE;
}
