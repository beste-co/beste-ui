/**
 * Central install-command builders for blocks, pieces and components.
 *
 * Commands are always BUILT in radix-canonical form (`/r/`, `/piece/r/`,
 * `/component/r/`). The UI applies `withFlavor` at render/copy time; the
 * default flavor is "base", matching shadcn's Base UI default, and rewrites
 * the path to the generated variant (`/r-base/`, `/piece/r-base/`, ...).
 */

import { DEFAULT_FLAVOR, SITE_ORIGIN } from "@/lib/site-links";

export type RegistryFlavor = "base" | "radix";

export const DEFAULT_REGISTRY_FLAVOR: RegistryFlavor = DEFAULT_FLAVOR;
export const REGISTRY_FLAVOR_STORAGE_KEY = "beste-registry-flavor";

export function registryBaseUrl(): string {
  return SITE_ORIGIN;
}

/** Rewrites a radix-canonical command/URL to the requested flavor. */
export function withFlavor(command: string, flavor: RegistryFlavor): string {
  if (flavor === "radix") return command;
  return command.replace("/r/", "/r-base/");
}

export function blockInstallCommand(
  name: string,
  license?: { email: string; licenseKey: string }
): string {
  const url = `${registryBaseUrl()}/r/${name}`;
  if (!license) return `npx shadcn add ${url}`;
  return `npx shadcn add "${url}?email=${encodeURIComponent(
    license.email
  )}&license_key=${encodeURIComponent(license.licenseKey)}"`;
}

/**
 * Fills a block README's install commands in for a reader who holds a license.
 *
 * Every gated README is written with `YOUR_EMAIL` / `YOUR_KEY` placeholders and
 * a line telling the reader to swap them. A customer who is signed in has
 * already told us both, so leaving them to copy the command, open their account
 * page, find the key, and paste it into two places is asking them to do work we
 * can do here — and it is the step where a wrong paste turns into "the CLI says
 * my license is invalid".
 *
 * Only ever called on the server, for the session that owns the license: the
 * key lands in that response's HTML and must not be cached across readers.
 */
export function personalizeDocs(
  source: string,
  license: { email: string; licenseKey: string }
): string {
  return source
    .replace(
      "Swap `YOUR_EMAIL` and `YOUR_KEY` for the email and license key on your account. Find your license key on your [account page](/account).",
      "The commands below already carry the email and license key on your account, so they are ready to paste. You can check them any time on your [account page](/account)."
    )
    .replaceAll("YOUR_EMAIL", encodeURIComponent(license.email))
    .replaceAll("YOUR_KEY", encodeURIComponent(license.licenseKey));
}

export function pieceInstallCommand(name: string): string {
  return `npx shadcn add ${registryBaseUrl()}/piece/r/${name}`;
}

export function componentInstallCommand(name: string): string {
  return `npx shadcn add ${registryBaseUrl()}/component/r/${name}`;
}
