import { NextResponse } from "next/server";
import { codeToHtml } from "shiki";
import { join } from "path";
import { readFile } from "fs/promises";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  try {
    const filePath = join(process.cwd(), "components", "beste", `${name}.tsx`);
    const code = await readFile(filePath, "utf-8");

    const html = await codeToHtml(code, {
      lang: "tsx",
      theme: "github-dark",
    });

    return NextResponse.json({ code, html });
  } catch {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }
}
