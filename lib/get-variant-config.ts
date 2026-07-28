import type { VariantConfig } from "@/lib/variant-types";

export async function getVariantConfig(slug: string): Promise<VariantConfig | null> {
  try {
    // Dynamic import with template literal - webpack analyzes the pattern
    // and includes all matching .variants files as separate chunks
    const module = await import(`@/registry/${slug}/${slug}.variants`);

    // Export is named {slug}Variants, e.g., usecase1Variants
    const variantKey = `${slug}Variants`;
    return module[variantKey] ?? null;
  } catch {
    // File doesn't exist or import failed - component has no variants
    return null;
  }
}
