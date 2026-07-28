"use client";

import type { ReactNode } from "react";

/**
 * Public-build auth context: permanently signed out.
 *
 * The header and the rest of the UI already know how to render this state, so
 * nothing downstream needs a second version of itself.
 */

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface Session {
  user: User;
}

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const SIGNED_OUT: AuthContextType = {
  session: null,
  loading: false,
  refreshSession: async () => {},
};

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuth(): AuthContextType {
  return SIGNED_OUT;
}
