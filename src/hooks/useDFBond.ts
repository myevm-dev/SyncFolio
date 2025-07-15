import {
  createThirdwebClient,
  defineChain,
  getContract,
  prepareContractCall,
  readContract,
  sendTransaction,
} from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { DFBondABI } from "../lib/DFBondABI";
import { ERC20_ABI } from "../lib/ERC20_ABI";

/* =====================================================================
   Constants & on‑chain addresses
   =====================================================================*/
export const BASE_CHAIN = defineChain(8453); // Base main‑net
export const DFBOND_ADDRESS =
  "0x2681D784e42AEA9eCe5fC3D5D6C05BE5199807F2" as const;
export const WETH_ADDRESS =
  "0x4200000000000000000000000000000000000006" as const; // Canonical WETH
export const MAX_UINT256 = (2n ** 256n) - 1n;

/* ---------------------------------------------------------------------
   Thirdweb client + contract handles
   -------------------------------------------------------------------*/
const client = createThirdwebClient({
  clientId: import.meta.env.VITE_TEMPLATE_CLIENT_ID,
});

export const dfBond = getContract({
  client,
  chain: BASE_CHAIN,
  address: DFBOND_ADDRESS,
  abi: DFBondABI as any,
});

const weth = getContract({
  client,
  chain: BASE_CHAIN,
  address: WETH_ADDRESS,
  abi: ERC20_ABI as any,
});

/* =====================================================================
   React hook – includes raw contract handle for advanced calls
   =====================================================================*/
export const useDFBond = () => {
  const activeAccount = useActiveAccount();
  const accountAddr = activeAccount?.address;

  /* ===================================================================
     Allowance helpers
     =================================================================*/
  const currentAllowance = async (): Promise<bigint> => {
    if (!accountAddr) return 0n;
    return (await readContract({
      contract: weth,
      method: "allowance",
      params: [accountAddr, DFBOND_ADDRESS],
    })) as bigint;
  };

  const ensureAllowance = async (minRequired: bigint) => {
    if (!activeAccount) throw new Error("Connect wallet first");
    const allowance = await currentAllowance();
    if (allowance >= minRequired) return;
    const tx = prepareContractCall({
      contract: weth,
      method: "approve",
      params: [DFBOND_ADDRESS, MAX_UINT256],
    });
    await sendTransaction({ account: activeAccount, transaction: tx });
  };

  /* ===================================================================
     Mutations (writes)
     =================================================================*/
  /** Create a fresh county token (no liquidity) */
  const createToken = async (
    name: string,
    symbol: string,
    maxSupply: bigint
  ): Promise<{ transactionHash: string }> => {
    if (!activeAccount) throw new Error("Connect wallet first");
    const tx = await prepareContractCall({
      contract: dfBond,
      method: "createToken",
      params: [name, symbol, maxSupply],
    });
    return sendTransaction({ account: activeAccount, transaction: tx });
  };

  /** Atomic create + buy (factory helper) */
  const launchOrBuy = async (
    name: string,
    symbol: string,
    reserveWei: bigint
  ) => {
    if (!activeAccount) throw new Error("Connect wallet first");
    await ensureAllowance(reserveWei);
    const tx = await prepareContractCall({
      contract: dfBond,
      method: "createAndBuy",
      params: [name, symbol, 1_000_000n, reserveWei],
    });
    return sendTransaction({ account: activeAccount, transaction: tx });
  };

  /** Buy existing county token */
  const buy = async (
    token: string,
    reserveWei: bigint,
    minReward: bigint = 0n
  ) => {
    if (!activeAccount) throw new Error("Connect wallet first");
    await ensureAllowance(reserveWei);
    const tx = prepareContractCall({
      contract: dfBond,
      method: "buy",
      params: [token, reserveWei, minReward],
    });
    return sendTransaction({ account: activeAccount, transaction: tx });
  };

  /** Sell county token */
  const sell = async (
    token: string,
    tokenAmt: bigint,
    minRefund: bigint = 0n
  ) => {
    if (!activeAccount) throw new Error("Connect wallet first");
    const tx = prepareContractCall({
      contract: dfBond,
      method: "sell",
      params: [token, tokenAmt, minRefund],
    });
    return sendTransaction({ account: activeAccount, transaction: tx });
  };

  /* ===================================================================
     Reads
     =================================================================*/
  const currentPrice = (token: string) =>
    readContract({ contract: dfBond, method: "currentPrice", params: [token] }) as Promise<bigint>;

  const getMintReward = (token: string, reserveWei: bigint) =>
    readContract({ contract: dfBond, method: "getMintReward", params: [token, reserveWei] }) as Promise<[bigint, bigint]>;

  const getBurnRefund = (token: string, tokenAmt: bigint) =>
    readContract({ contract: dfBond, method: "getBurnRefund", params: [token, tokenAmt] }) as Promise<[bigint, bigint]>;

  /* ===================================================================
     Exposed API
     =================================================================*/
  return {
    connected: !!activeAccount,
    MAX_UINT256,
    currentAllowance,
    approveWeth: ensureAllowance,
    createToken,
    launchOrBuy,
    buy,
    sell,
    currentPrice,
    getMintReward,
    getBurnRefund,
    dfBond,
  };
};
