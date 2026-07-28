"use client";

import { useEffect, useState } from "react";
import { FitScale } from "@/components/fit-scale";
import { FRAME_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { getRegistryComponent } from "@/lib/registry-components";

interface RegistryComponentDemoProps {
  name: string;
}

export function RegistryComponentDemo({ name }: RegistryComponentDemoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const meta = getRegistryComponent(name);
  if (!meta) return null;

  const Component = meta.component;

  // Large-surface categories get fit-scaled so the whole demo shows at its
  // natural proportions, like block previews
  if (FRAME_PREVIEW_CATEGORIES.has(meta.category)) {
    return (
      <FitScale>
        <Component {...meta.demoProps} />
      </FitScale>
    );
  }

  return <Component {...meta.demoProps} />;
}
