"use client";

import { useEffect, useState } from "react";
import { CardDemo } from "@/components/card-demo";
import { getRegistryComponent } from "@/lib/registry-components";

interface RegistryComponentDemoProps {
  name: string;
  /** Laid over the demo props, for a surface that needs the demo to differ a little. */
  props?: Record<string, unknown>;
}

export function RegistryComponentDemo({ name, props }: RegistryComponentDemoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const meta = getRegistryComponent(name);
  if (!meta) return null;

  return <CardDemo entry={props ? { ...meta, demoProps: { ...meta.demoProps, ...props } } : meta} />;
}
