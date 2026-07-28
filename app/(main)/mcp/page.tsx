import { permanentRedirect } from "next/navigation";

// The MCP docs moved under /docs. Keep the old URL working.
export default function McpRedirect() {
  permanentRedirect("/docs/mcp");
}
