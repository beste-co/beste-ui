// The order a listing comes in: the vocabulary the URL, the picker and the
// server page all share, plus the sort itself.
//
// Deliberately free of imports, and the sort takes the dates as a callback
// rather than reading them: ship dates come from the changelog, which reaches
// the live registry through `data/changelog.ts`, and the pickers that use this
// vocabulary are client components. The caller is a server component and hands
// in `getBlockAddedDate` and friends from `lib/changelog-dates.ts`.

export type BrowseSort = "newest" | "oldest" | "name";

/**
 * What a listing shows before anyone asks. The catalogue is generated in
 * directory order, which puts about1 first and everything built this year at the
 * bottom: honest as a filesystem listing, useless as a shop window.
 */
export const DEFAULT_SORT: BrowseSort = "newest";

export const SORT_OPTIONS: readonly { value: BrowseSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name" },
];

export function parseSort(value: string | string[] | undefined): BrowseSort {
  const raw = Array.isArray(value) ? value[0] : value;
  return SORT_OPTIONS.some((o) => o.value === raw) ? (raw as BrowseSort) : DEFAULT_SORT;
}

/**
 * Newest or oldest first, by the date each item shipped.
 *
 * Anything the changelog has no date for sorts at the old end. For blocks that
 * is a couple of dozen from before the log existed; for pieces it is most of the
 * catalogue, which means "newest" there is really "the ones we have a date for,
 * then everything else in catalogue order". That is still the useful answer, and
 * it improves by itself as entries are written.
 */
export function sortByAdded<T extends { name: string }>(
  items: readonly T[],
  sort: BrowseSort,
  addedDate: (name: string) => string | undefined
): readonly T[] {
  if (sort === "name") return items;

  const newest = sort === "newest";
  // Undated items sort below every real date, so an empty string is exactly the
  // comparison key they want.
  const dated = items.map((item, index) => ({
    item,
    index,
    date: addedDate(item.name) ?? "",
  }));

  dated.sort((a, b) => {
    if (a.date !== b.date) return newest ? (a.date < b.date ? 1 : -1) : a.date < b.date ? -1 : 1;
    // A batch shipped on one day keeps its catalogue order, read from whichever
    // end matches the sort, so feature255 leads its own release.
    return newest ? b.index - a.index : a.index - b.index;
  });

  return dated.map((d) => d.item);
}
