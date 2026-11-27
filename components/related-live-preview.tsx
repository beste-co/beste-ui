"use client";

import type { ComponentType } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { CardDemo } from "@/components/card-demo";
import { getBlockObfuscated } from "@/lib/blocks-obfuscated";
import { getRegistryComponent } from "@/lib/registry-components";

const PAGE_WIDTH = 1440;
const PAGE_HEIGHT = 900;

/** A block laid out at desktop width and scaled down to the card, top aligned. */
export function LiveBlock({ name }: { name: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const block = getBlockObfuscated(name);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const update = () => setScale(outer.clientWidth / PAGE_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    return () => observer.disconnect();
  }, []);

  if (!block) return null;
  const Component: ComponentType<any> = block.component;
  return (
    <div ref={outerRef} inert className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {scale > 0 && (
        <div
          className="absolute top-0 left-0 origin-top-left bg-background"
          style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, transform: `scale(${scale})` }}
        >
          <Component {...block.demoProps} />
        </div>
      )}
    </div>
  );
}

/** A component in the same fit its listing card gives it. */
export function LiveComponent({ name }: { name: string }) {
  const meta = getRegistryComponent(name);
  if (!meta) return null;
  return (
    <div inert className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <CardDemo entry={meta} kind="component" />
    </div>
  );
}
