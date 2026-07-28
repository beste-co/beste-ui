import { NextResponse } from "next/server";
import { blocks } from "@/lib/blocks";
import { categoryInfoMap } from "@/lib/category-info";

interface CategoryData {
  url: string;
  title: string;
  keywords: string[];
}

function toSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function GET() {
  const categories = [...new Set(blocks.map((b) => b.category))].filter(
    (c) => toSlug(c) !== "all"
  );

  const categoryData: CategoryData[] = categories.map((category) => {
    const slug = toSlug(category);
    return {
      url: `https://ui.beste.co/blocks/${slug}`,
      title: `${category} blocks`,
      keywords: categoryInfoMap[slug]?.keywords || [],
    };
  });

  return NextResponse.json(categoryData);
}
