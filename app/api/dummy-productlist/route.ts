import { NextResponse } from "next/server";

/**
 * Dummy catalog backing the productlist block demos.
 *
 * GET /api/dummy-productlist?filters=<json>&sort=&page=&pageSize=
 * Response: { products, totalCount, page, pageSize }
 *
 * CORS is open so the same hosted endpoint can back the productlist blocks
 * even when they run inside another project (installed via the CLI).
 *
 * Filter semantics by group id (matching the demo filterGroups):
 * - "q": every word must match the title or keywords (case-insensitive)
 * - "price": any "min-max" range containing the price (open ends allowed)
 * - "rating": product rating >= the first value
 * - anything else: product.attributes[id] intersects the selected values
 */

interface DummyProduct {
  title: string;
  href: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  image: { src: string; alt: string };
  badge?: string;
  rating: number;
  reviewCount: number;
  keywords: string[];
  attributes: Record<string, string[]>;
}

const ADJECTIVES = [
  "Velocity",
  "Court",
  "Stealth",
  "Skyline",
  "Heritage",
  "Summit",
  "Coastal",
  "Metro",
  "Nomad",
  "Atlas",
  "Ember",
  "Frost",
];

const STYLES = [
  "Classic",
  "Studio",
  "Trail",
  "Urban",
  "Prime",
  "Everyday",
  "Sport",
  "Craft",
];

const BRANDS = [
  { label: "Acme Supply", value: "acme" },
  { label: "Northwind", value: "northwind" },
  { label: "Globex", value: "globex" },
  { label: "Initech", value: "initech" },
  { label: "Vandelay", value: "vandelay" },
  { label: "Umbra Works", value: "umbra" },
];

const COLORS = ["black", "white", "blue", "red", "green"];
const GENDERS = ["women", "men", "unisex"];
const SIZE_SETS = [
  ["s", "m", "l"],
  ["m", "l", "xl"],
  ["s", "m", "l", "xl"],
];

interface SubcategorySpec {
  category: string;
  value: string;
  noun: string;
  basePrice: number;
  hasSizes: boolean;
  images: string[];
}

const SUBCATEGORIES: SubcategorySpec[] = [
  {
    category: "shoes",
    value: "sneakers",
    noun: "Sneakers",
    basePrice: 95,
    hasSizes: true,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=800&fit=crop",
    ],
  },
  {
    category: "shoes",
    value: "boots",
    noun: "Boots",
    basePrice: 150,
    hasSizes: true,
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop",
    ],
  },
  {
    category: "shoes",
    value: "sandals",
    noun: "Sandals",
    basePrice: 55,
    hasSizes: true,
    images: [
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=800&fit=crop",
    ],
  },
  {
    category: "apparel",
    value: "t-shirts",
    noun: "Tee",
    basePrice: 30,
    hasSizes: true,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=800&fit=crop",
    ],
  },
  {
    category: "apparel",
    value: "hoodies",
    noun: "Hoodie",
    basePrice: 70,
    hasSizes: true,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop",
    ],
  },
  {
    category: "apparel",
    value: "jackets",
    noun: "Jacket",
    basePrice: 130,
    hasSizes: true,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    ],
  },
  {
    category: "accessories",
    value: "bags",
    noun: "Bag",
    basePrice: 85,
    hasSizes: false,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop",
    ],
  },
  {
    category: "accessories",
    value: "watches",
    noun: "Watch",
    basePrice: 210,
    hasSizes: false,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=800&fit=crop",
    ],
  },
  {
    category: "accessories",
    value: "belts",
    noun: "Belt",
    basePrice: 45,
    hasSizes: false,
    images: [
      "https://images.unsplash.com/photo-1553143820-6bb68bc34679?w=600&h=800&fit=crop",
    ],
  },
];

/** 100 deterministic products so pagination stays stable across requests. */
function buildCatalog(): DummyProduct[] {
  return Array.from({ length: 100 }, (_, i) => {
    const sub = SUBCATEGORIES[i % SUBCATEGORIES.length] as SubcategorySpec;
    const adjective = ADJECTIVES[i % ADJECTIVES.length];
    const style = STYLES[Math.floor(i / ADJECTIVES.length) % STYLES.length];
    const brand = BRANDS[i % BRANDS.length] as (typeof BRANDS)[number];
    const color = COLORS[i % COLORS.length] as string;
    const secondColor =
      i % 4 === 0 ? (COLORS[(i + 2) % COLORS.length] as string) : null;
    const gender = GENDERS[i % GENDERS.length] as string;
    const sizes = SIZE_SETS[i % SIZE_SETS.length] as string[];
    const onSale = i % 5 === 0;
    const isNew = i % 7 === 3;
    const price = sub.basePrice + ((i * 7) % 90);
    const rating = Math.round((3.6 + ((i * 13) % 15) / 10) * 10) / 10;

    const flags = [...(onSale ? ["sale"] : []), ...(isNew ? ["new"] : [])];
    const colors = [color, ...(secondColor ? [secondColor] : [])];

    return {
      title: `${adjective} ${style} ${sub.noun}`,
      href: "https://beste.co",
      brand: brand.label,
      price,
      ...(onSale
        ? { compareAtPrice: price + 20 + (i % 3) * 10, badge: "Sale" }
        : isNew
          ? { badge: "New" }
          : {}),
      image: {
        src: sub.images[i % sub.images.length] as string,
        alt: `${adjective} ${style} ${sub.noun}`,
      },
      rating,
      reviewCount: 20 + ((i * 37) % 480),
      keywords: [sub.category, sub.value, ...colors],
      attributes: {
        category: [sub.category],
        subcategory: [sub.value],
        // Combined value list so hierarchical (tree) groups can match either level
        cat: [sub.category, sub.value],
        brand: [brand.value],
        ...(sub.hasSizes ? { size: sizes } : {}),
        color: colors,
        gender: [gender],
        ...(flags.length > 0 ? { flags } : {}),
      },
    };
  });
}

const CATALOG = buildCatalog();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function parseRange(value: string): [number, number] | null {
  const [min, max] = value.split("-").map(Number);
  const lower = Number.isFinite(min) ? (min as number) : 0;
  const upper = Number.isFinite(max)
    ? (max as number)
    : Number.POSITIVE_INFINITY;
  if (!Number.isFinite(min) && !Number.isFinite(max)) return null;
  return [lower, upper];
}

function matchesFilters(
  product: DummyProduct,
  filters: Record<string, string[]>
): boolean {
  return Object.entries(filters).every(([groupId, selected]) => {
    if (!Array.isArray(selected) || selected.length === 0) return true;
    if (groupId === "q") {
      const haystack = [product.title, ...product.keywords]
        .join(" ")
        .toLowerCase();
      return String(selected[0])
        .toLowerCase()
        .split(/\s+/)
        .every((word) => haystack.includes(word));
    }
    if (groupId === "price") {
      return selected.some((value) => {
        const range = parseRange(String(value));
        if (!range) return true;
        return product.price >= range[0] && product.price <= range[1];
      });
    }
    if (groupId === "rating") {
      return product.rating >= Number(selected[0]);
    }
    const values = product.attributes[groupId] ?? [];
    return selected.some((value) => values.includes(String(value)));
  });
}

function sortCatalog(products: DummyProduct[], sort: string): DummyProduct[] {
  const next = [...products];
  if (sort === "price-asc") next.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") next.sort((a, b) => b.price - a.price);
  if (sort === "rating") next.sort((a, b) => b.rating - a.rating);
  return next;
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  let filters: Record<string, string[]> = {};
  try {
    const parsed = JSON.parse(url.searchParams.get("filters") ?? "{}");
    if (parsed && typeof parsed === "object") filters = parsed;
  } catch {
    // malformed filters param: treat as no filters
  }

  const sort = url.searchParams.get("sort") ?? "featured";
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const pageSize = Math.min(
    60,
    Math.max(1, Number(url.searchParams.get("pageSize")) || 20)
  );

  const matching = sortCatalog(
    CATALOG.filter((product) => matchesFilters(product, filters)),
    sort
  );

  // Small artificial latency so the blocks' loading states are visible
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(
    {
      products: matching.slice((page - 1) * pageSize, page * pageSize),
      totalCount: matching.length,
      page,
      pageSize,
    },
    { headers: CORS_HEADERS }
  );
}
