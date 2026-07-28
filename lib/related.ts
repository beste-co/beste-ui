// Deterministic "neighbor window" selection for related items.
//
// Instead of always showing the first N items of a category (so about25 and
// about26 would show the identical about1..about6), we take the items closest
// to the current one by position, expanding outward and excluding self. This
// varies per page, stays stable across requests (cache/SSR friendly, unlike
// random), and reads naturally: about26 -> 23,24,25,27,28,29.
export function neighborWindow<T>(
  items: readonly T[],
  currentIndex: number,
  count: number
): T[] {
  if (currentIndex < 0) return items.slice(0, count) as T[];

  const picked: number[] = [];
  let distance = 1;
  while (
    picked.length < count &&
    (currentIndex - distance >= 0 || currentIndex + distance < items.length)
  ) {
    const lo = currentIndex - distance;
    const hi = currentIndex + distance;
    if (lo >= 0) picked.push(lo);
    if (picked.length >= count) break;
    if (hi < items.length) picked.push(hi);
    distance++;
  }

  return picked
    .sort((a, b) => a - b)
    .map((i) => items[i]!) as T[];
}
