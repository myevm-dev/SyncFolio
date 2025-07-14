// src/hooks/useDFBond.ts
import {
  createThirdwebClient,
  defineChain,
  getContract,
  prepareContractCall,
  readContract,
  sendTransaction,
  type PreparedTransaction,
} from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { DFBondABI } from "../lib/DFBondABI";
import { ERC20_ABI } from "../lib/ERC20_ABI";

/* =====================================================================
   Constants & on‑chain addresses
   =====================================================================*/
export const BASE_CHAIN = defineChain(8453);               // Base main‑net
export const DFBOND_ADDRESS =
  "0x2681D784e42AEA9eCe5fC3D5D6C05BE5199807F2" as const;
export const WETH_ADDRESS =
  "0x4200000000000000000000000000000000000006" as const;   // Canonical WETH
export const MAX_UINT256 = (2n ** 256n) - 1n;              // “infinite” allowance

/* ---------------------------------------------------------------------
   Thirdweb client + contract handles
   -------------------------------------------------------------------*/
const client = createThirdwebClient({
  clientId: import.meta.env.VITE_TEMPLATE_CLIENT_ID,
});

const dfBond = getContract({
  client,
  chain: BASE_CHAIN,
  address: DFBOND_ADDRESS,
  abi: DFBondABI as any,
});

const weth = getContract({
  client,
  chain: BASE_CHAIN,
  address: WETH_ADDRESS,
  abi: ERC20_ABI as any,        // must expose *allowance* & *approve*
});

/* =====================================================================
   React hook               – safe to call even before wallet connects
   =====================================================================*/
export const useDFBond = () => {
  /* ---------------- Wallet ----------------*/
  const activeAccount = useActiveAccount();          // `undefined` until wallet connects
  const accountAddr   = activeAccount?.address;      // convenience alias

  /* ===================================================================
     Helpers
     =================================================================*/
  /** Current WETH allowance the user gave to the DFBond contract */
  const currentAllowance = async (): Promise<bigint> => {
    if (!accountAddr) return 0n;
    return (await readContract({
      contract: weth,
      method: "allowance",
      params: [accountAddr, DFBOND_ADDRESS],
    })) as bigint;
  };

  /** Approve WETH only if needed */
  const ensureAllowance = async (minRequired: bigint) => {
    if (!activeAccount) throw new Error("Connect wallet first");

    const allowance = await currentAllowance();
    if (allowance >= minRequired) return; // already sufficient

    // Approve MAX_UINT256 so we don't ask the user again next time
    const tx = prepareContractCall({
      contract: weth,
      method: "approve",
      params: [DFBOND_ADDRESS, MAX_UINT256],
    });
    await sendTransaction({ account: activeAccount, transaction: tx });
  };

  /** Whether a county token already exists (to avoid create‑and‑fail) */
  const tokenExists = async (symbol: string): Promise<boolean> => {
    return (await readContract({
      contract: dfBond,
      method: "exists",
      params: [symbol],
    })) as boolean;
  };

  /* ===================================================================
     Mutations (writes)
     =================================================================*/
  /**
   * Launch a brand‑new county token *or* fall back to buying if it already
   * exists.  This prevents the generic `execution reverted` error the user
   * saw when they tried to deploy twice.
   */
  const launchOrBuy = async (
    name: string,
    symbol: string,
    reserveWei: bigint,
  ) => {
    if (!activeAccount) throw new Error("Connect wallet first");

    // 1️⃣ make sure DFBond can pull the user's WETH
    await ensureAllowance(reserveWei);

    // 2️⃣ try cheap read first – if token already active just buy
    if (await tokenExists(symbol)) {
      return buy(symbol, reserveWei);
    }

    // 3️⃣ create with a human‑scaled cap – contract multiplies by 1e18 itself
    const tx = prepareContractCall({
      contract: dfBond,
      method: "createAndBuy",
      params: [name, symbol, 1_000_000n, reserveWei], // cap = 1 000 000 tokens
    });

    return sendTransaction({ account: activeAccount, transaction: tx });
  };

  const buy = async (
    token: string,
    reserveWei: bigint,
    minReward: bigint = 0n,
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

  const sell = async (
    token: string,
    tokenAmt: bigint,
    minRefund: bigint = 0n,
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
    readContract({
      contract: dfBond,
      method: "currentPrice",
      params: [token],
    }) as Promise<bigint>;

  const getMintReward = (token: string, reserveWei: bigint) =>
    readContract({
      contract: dfBond,
      method: "getMintReward",
      params: [token, reserveWei],
    }) as Promise<[bigint, bigint]>;

  const getBurnRefund = (token: string, tokenAmt: bigint) =>
    readContract({
      contract: dfBond,
      method: "getBurnRefund",
      params: [token, tokenAmt],
    }) as Promise<[bigint, bigint]>;

  /* ===================================================================
     Exposed API
     =================================================================*/
  return {
    /* connection */
    connected: !!activeAccount,

    /* allowance helpers */
    MAX_UINT256,
    currentAllowance,
    approveWeth: ensureAllowance,   // keep same name for callers

    /* writes */
    launchOrBuy,                    // new safe entry‑point
    buy,
    sell,

    /* reads */
    currentPrice,
    getMintReward,
    getBurnRefund,
  };
};
