"use client";

import { useEffect, useState } from "react";
import { getComponent } from "@/lib/components";

interface ComponentDemoProps {
  name: string;
}

export function ComponentDemo({ name }: ComponentDemoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const meta = getComponent(name);
  if (!meta) return null;

  const Component = meta.component;
  return <Component {...meta.demoProps} />;
}
