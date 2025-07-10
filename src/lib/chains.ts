// lib/chains.ts
export interface ChainInfo {
  name: string;
  chainId: number;
  rpcUrl?: string;
}

export const CHAINS: Record<string, ChainInfo> = {
  ethereum:      { name: "Ethereum Mainnet",  chainId: 1 },
  optimism:      { name: "Optimism",          chainId: 10 },
  base:          { name: "Base",              chainId: 8453 },
  arbitrum:      { name: "Arbitrum One",      chainId: 42161 },
  polygon:       { name: "Polygon",           chainId: 137 },
};
