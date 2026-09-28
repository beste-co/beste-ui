"use client";

import { BackgroundDemoContent } from "@/components/background-demo-content";
import { BACKGROUND_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { getRegistryComponent } from "@/lib/registry-components";
import { cn } from "@/lib/utils";

interface RegistryComponentEmbedPreviewProps {
  slug: string;
  /** Optional tone override merged into the demo props */
  tone?: string;
}

export function RegistryComponentEmbedPreview({
  slug,
  tone,
}: RegistryComponentEmbedPreviewProps) {
  const meta = getRegistryComponent(slug);
  if (!meta) return null;

  const Component = meta.component;
  const props = tone ? { ...meta.demoProps, tone } : meta.demoProps;

  if (BACKGROUND_PREVIEW_CATEGORIES.has(meta.category)) {
    const given = (props as Record<string, unknown> | undefined)?.className;
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <Component {...props} className={cn(typeof given === "string" ? given : undefined, "absolute inset-0 h-full min-h-0")} />
        {!meta.demoContentOff && <BackgroundDemoContent tone={meta.demoContentTone} />}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Component {...props} />
    </div>
  );
}
