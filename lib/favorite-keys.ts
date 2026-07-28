// Favorite key namespaces.
//
// Historically both "pieces" and registry "components" were saved with the
// `component:` prefix, which collides for the 28 names that exist in both sets
// (card1..card28). New favorites use distinct prefixes so they never collide:
//   - pieces            -> `component:${name}`            (unchanged, legacy-compatible)
//   - registry components -> `registry-component:${name}` (new)
//
// Backward compatibility: a legacy `component:${name}` key is still honored as a
// registry-component favorite, but ONLY when the name is unambiguous, i.e. it does
// not also belong to a piece. Those unambiguous names are frozen in
// LEGACY_SAFE_REGISTRY_NAMES below. For the ambiguous overlapping names, a legacy
// `component:` key stays attributed to the piece (its original, pre-split meaning),
// so nothing that was saved before is lost or reassigned.

export const PIECE_PREFIX = "component:";
export const REGISTRY_COMPONENT_PREFIX = "registry-component:";

/**
 * Registry component names that had no colliding piece at the time the key
 * namespaces were split. For these, a legacy `component:${name}` favorite can
 * only mean the registry component, so we keep honoring it. This set is a frozen
 * snapshot: legacy data never changes, so it never needs regenerating.
 */
export const LEGACY_SAFE_REGISTRY_NAMES: ReadonlySet<string> = new Set([
  "badge6",
  "badge7",
  "badge8",
  "badge9",
  "badge10",
  "badge11",
  "badge12",
  "badge13",
  "badge14",
  "badge15",
  "badge16",
  "badge17",
  "badge18",
  "badge19",
  "badge20",
  "badge21",
  "badge22",
  "badge23",
  "button1",
  "button2",
  "button3",
  "button4",
  "button5",
  "button6",
  "button7",
  "button11",
  "button12",
  "button13",
  "button14",
  "button15",
  "button16",
  "button17",
  "button18",
  "button19",
  "button20",
  "button21",
]);

export function pieceFavoriteKey(name: string): string {
  return `${PIECE_PREFIX}${name}`;
}

export function registryComponentFavoriteKey(name: string): string {
  return `${REGISTRY_COMPONENT_PREFIX}${name}`;
}

function includesKey(favorites: readonly string[] | ReadonlySet<string>, key: string): boolean {
  return favorites instanceof Set ? favorites.has(key) : (favorites as readonly string[]).includes(key);
}

/** True if this registry component is favorited, honoring the legacy key when unambiguous. */
export function isRegistryComponentFavorited(
  name: string,
  favorites: readonly string[] | ReadonlySet<string>
): boolean {
  if (includesKey(favorites, registryComponentFavoriteKey(name))) return true;
  if (LEGACY_SAFE_REGISTRY_NAMES.has(name) && includesKey(favorites, pieceFavoriteKey(name))) {
    return true;
  }
  return false;
}

/**
 * The favorite keys to remove when un-favoriting a registry component: the new
 * key plus, when unambiguous, any lingering legacy key so it doesn't reappear.
 */
export function registryComponentKeysToRemove(
  name: string,
  favorites: readonly string[] | ReadonlySet<string>
): string[] {
  const keys: string[] = [];
  if (includesKey(favorites, registryComponentFavoriteKey(name))) {
    keys.push(registryComponentFavoriteKey(name));
  }
  if (LEGACY_SAFE_REGISTRY_NAMES.has(name) && includesKey(favorites, pieceFavoriteKey(name))) {
    keys.push(pieceFavoriteKey(name));
  }
  return keys;
}
