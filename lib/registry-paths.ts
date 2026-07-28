import path from "node:path";

/**
 * Public-build registry paths.
 *
 * Nothing here is paid, so every item is served from `public/` and there is no
 * protected directory to route around. The `isPro` argument is kept so callers
 * are identical to the private build's.
 */

export type RegistryVariant = "radix" | "base";

export function blockJsonPath(
  name: string,
  _isPro: boolean,
  variant: RegistryVariant
): string {
  const cwd = process.cwd();
  const file = `${name}.json`;

  return variant === "base"
    ? path.join(cwd, "public", "r-base", file)
    : path.join(cwd, "public", "r", file);
}
