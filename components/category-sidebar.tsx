"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { blocks } from "@/lib/blocks";
import { categoryInfoMap } from "@/lib/category-info";
import { useSearch } from "@/lib/search-store";
import { cn } from "@/lib/utils";

// Convert category name to URL slug (kebab-case)
function toSlug(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export type CategorySortType = "priority" | "alphabetical" | "count";

// Category priority order (higher = more important, shown first)
const categoryPriority: Record<string, number> = {
  All: 100,
  Hero: 90,
  Feature: 85,
  CTA: 80,
  Pricing: 75,
  Testimonial: 70,
  FAQ: 65,
  Contact: 60,
  Footer: 55,
  Navbar: 50,
  // Other categories get default priority of 0
};

function getCategoryPriority(category: string): number {
  return categoryPriority[category] ?? 0;
}

interface CategorySidebarProps {
  onCategoryClick?: () => void;
  sortType?: CategorySortType;
}

export function CategorySidebar({ onCategoryClick, sortType = "count" }: CategorySidebarProps) {
  const pathname = usePathname();

  // Try to get search context (may not be available outside SearchProvider)
  let searchQuery = "";
  try {
    const search = useSearch();
    searchQuery = search.query;
  } catch {
    // Not within SearchProvider, use empty query
  }

  // Get unique categories from blocks
  const allCategories = useMemo(() => {
    const cats = ["All", ...new Set(blocks.map((b) => b.category))];
    return cats;
  }, []);

  // Sort categories based on sort type
  const sortedAllCategories = useMemo(() => {
    return [...allCategories].sort((a, b) => {
      // Always keep "All" at the top
      if (a === "All") return -1;
      if (b === "All") return 1;

      switch (sortType) {
        case "alphabetical":
          return a.localeCompare(b);
        case "count": {
          const countA = blocks.filter((block) => block.category === a).length;
          const countB = blocks.filter((block) => block.category === b).length;
          return countB - countA; // Descending order
        }
        case "priority":
        default:
          return getCategoryPriority(b) - getCategoryPriority(a);
      }
    });
  }, [allCategories, sortType]);

  // Filter categories based on search query
  const categories = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedAllCategories;
    }

    const query = searchQuery.toLowerCase();

    // Find categories that match directly or have matching blocks
    const matchingCategories = sortedAllCategories.filter((category) => {
      if (category === "All") return true;

      // Check if category name matches
      if (category.toLowerCase().includes(query)) return true;

      // Check if any block in this category matches
      const categoryBlocks = blocks.filter((b) => b.category === category);
      return categoryBlocks.some(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.name.toLowerCase().includes(query)
      );
    });

    // If no categories match, show all
    return matchingCategories.length > 1 ? matchingCategories : sortedAllCategories;
  }, [sortedAllCategories, searchQuery]);

  // Determine selected category from pathname
  const selectedCategory = useMemo(() => {
    if (pathname === "/") {
      return null; // No category selected on homepage
    }
    // /blocks is the "All" category
    if (pathname === "/blocks") {
      return "All";
    }
    // pathname is like /blocks/use-case
    const match = pathname.match(/^\/blocks\/(.+)$/);
    if (match) {
      const slug = match[1];
      // Find category that matches this slug
      return allCategories.find((c) => toSlug(c) === slug) || null;
    }
    return null;
  }, [pathname, allCategories]);

  // Helper to get category URL
  const getCategoryUrl = (category: string) => {
    if (category === "All") {
      return "/blocks";
    }
    return `/blocks/${toSlug(category)}`;
  };

  // Get block count for category (filtered by search if active)
  const getBlockCount = (category: string) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return category === "All"
        ? blocks.length
        : blocks.filter((b) => b.category === category).length;
    }

    const categoryBlocks =
      category === "All" ? blocks : blocks.filter((b) => b.category === category);

    return categoryBlocks.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.name.toLowerCase().includes(query)
    ).length;
  };

  return (
    <div className="p-4">
      <div className="space-y-0.5">
        {categories.map((category) => {
          const count = getBlockCount(category);

          const slug = toSlug(category);
          const info = categoryInfoMap[slug];

          return (
            <Link
              key={category}
              href={getCategoryUrl(category)}
              onClick={onCategoryClick}
              className={cn(
                "flex items-center justify-between w-full text-left px-2 py-2 rounded-md text-base transition-colors duration-150",
                selectedCategory === category
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-1.5">
                {category}
                {info?.isNew && (
                  <span className="px-1.5 py-0.5 text-sm font-semibold uppercase bg-emerald-500 text-white rounded">
                    new
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-base text-muted-foreground",
                  count >= 1000 && "font-bold animate-[color-cycle_3s_ease-in-out_infinite]"
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
