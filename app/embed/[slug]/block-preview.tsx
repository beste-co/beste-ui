"use client";

import { getBlock } from "@/lib/blocks";
import { getBlockObfuscated } from "@/lib/blocks-obfuscated";
import { usePreviewVariants } from "@/lib/preview-variants-store";

interface BlockPreviewProps {
  slug: string;
  hasPro?: boolean;
}

export function BlockPreview({ slug, hasPro = false }: BlockPreviewProps) {
  // Pro users see original Tailwind classes, non-Pro see obfuscated classes.
  // In development ALWAYS use the live block: the obfuscated build is a
  // generated snapshot (@/.generated/obfuscated-source/*) that doesn't update on
  // edits, so serving it here breaks hot-reload. The live import hot-reloads and
  // renders identically (obfuscation only mangles class names, not behavior).
  const useLive = hasPro || process.env.NEXT_PUBLIC_ENVIRONMENT === "staging";
  const block = useLive ? getBlock(slug) : getBlockObfuscated(slug);
  const { variants } = usePreviewVariants();

  if (!block) {
    return null;
  }

  const Component = block.component;
  const mergedProps = { ...block.demoProps, ...variants };

  return <Component {...mergedProps} />;
}
