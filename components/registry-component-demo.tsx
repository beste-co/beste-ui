"use client";

import { useEffect, useState } from "react";
import { CardDemo } from "@/components/card-demo";
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

  return <CardDemo entry={meta} />;
}
