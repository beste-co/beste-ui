"use client";

import { getRegistryComponent } from "@/lib/registry-components";

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

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Component {...props} />
    </div>
  );
}
