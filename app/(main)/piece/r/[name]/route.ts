import { NextResponse } from "next/server";
import { getComponent } from "@/lib/components";
import { buildSingleFileItemJson, readItemSource } from "@/lib/registry-serving";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const component = getComponent(name);

  if (!component) {
    return NextResponse.json({ error: "Piece not found" }, { status: 404 });
  }

  const content = await readItemSource("registry-pieces", name, "radix");
  if (content === null) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }

  return NextResponse.json(
    buildSingleFileItemJson({
      name: component.name,
      title: component.title,
      description: component.description,
      registryDependencies: component.registryDependencies ?? [],
      sourceDir: "registry-pieces",
      targetDir: "piece",
      content,
    })
  );
}
