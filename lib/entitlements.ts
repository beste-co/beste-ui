/**
 * Public-build entitlements.
 *
 * There is no paid tier in this repository and no database behind it, so every
 * question about paid access has the same answer: nobody is signed in, nothing
 * is gated. The private build swaps this file for one that resolves a real
 * session against real licenses; everything that imports it is identical in
 * both, which is what keeps the two from drifting apart.
 */

export interface Viewer {
  isPro: boolean;
  email: string | null;
  licenseKey: string | null;
}

const ANONYMOUS: Viewer = { isPro: false, email: null, licenseKey: null };

export async function getViewer(_options: { withLicenseKey?: boolean } = {}): Promise<Viewer> {
  return ANONYMOUS;
}

export async function isProAuthorized(_request: Request): Promise<boolean> {
  return false;
}

export async function validateLicenseCredentials(
  _email: string,
  _licenseKey: string
): Promise<{ isValid: boolean; error?: string }> {
  return { isValid: false, error: "This build has no licensing." };
}
