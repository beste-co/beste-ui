import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "crypto35",
  title: "Contract Address List",
  description:
    "Smart contract addresses with copy-to-clipboard and explorer link buttons. Verified badge indicator, chain name, and truncated addresses with monospace font.",
  category: "Crypto",
  registryDependencies: ["button"],
};
