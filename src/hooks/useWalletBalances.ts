// /hooks/useWalletBalances.ts
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { base }                 from "thirdweb/chains";
import { client }               from "../client";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const useWalletBalances = () => {
  const account = useActiveAccount();
  const address = account?.address;

  const eth = useWalletBalance({
    client,
    chain: base,
    address,
    // ← remove tokenAddress entirely for native ETH
  });

  const usdc = useWalletBalance({
    client,
    chain: base,
    address,
    tokenAddress: USDC_ADDRESS,
  });

  return {
    eth:  eth.data  ? parseFloat(eth.data.displayValue)  : 0,
    usdc: usdc.data ? parseFloat(usdc.data.displayValue) : 0,
    isLoading: eth.isLoading || usdc.isLoading,
    error:     eth.error     || usdc.error,
  };
};
