"use client";

import { getBlock } from "@/lib/blocks";
import { getBlockObfuscated } from "@/lib/blocks-obfuscated";
import { usePreviewVariants } from "@/lib/preview-variants-store";

interface BlockPreviewProps {
  slug: string;
  hasPro?: boolean;
}

export function BlockPreview({ slug, hasPro = false }: BlockPreviewProps) {

  const useLive = hasPro || process.env.NODE_ENV === "development";
  const block = useLive ? getBlock(slug) : getBlockObfuscated(slug);
  const { variants } = usePreviewVariants();

  if (!block) {
    return null;
  }

  const Component = block.component;
  const mergedProps = { ...block.demoProps, ...variants };

  return <Component {...mergedProps} />;
}
