import { NextResponse } from "next/server";
import { getRegistryComponent } from "@/lib/registry-components";
import { buildComponentItemJson, normalizeItemName } from "@/lib/registry-serving";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name: rawName } = await params;
  const name = normalizeItemName(rawName);
  const component = getRegistryComponent(name);

  if (!component) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }

  const item = await buildComponentItemJson({
    component,
    variant: "radix",
    resolve: getRegistryComponent,
  });
  if (item === null) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}
