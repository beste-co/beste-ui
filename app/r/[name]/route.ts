import { serveBlockJson } from "@/lib/registry-serving";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  return serveBlockJson(request, name, "radix");
}
