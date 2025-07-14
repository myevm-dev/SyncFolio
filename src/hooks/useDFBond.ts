// src/hooks/useDFBond.ts
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { DFBondABI } from "../lib/DFBondABI";

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_TEMPLATE_CLIENT_ID, // put your true client-id in .env
});

const BASE_CHAIN = defineChain(8453);                       // Base mainnet
const DFBOND_ADDRESS = "0x2681D784e42AEA9eCe5fC3D5D6C05BE5199807F2";

// ────────────────────────────────────────────────────────────
//  Cast to any to avoid strict-ABI generics headaches
// ────────────────────────────────────────────────────────────
const dfBond = getContract({
  client,
  chain: BASE_CHAIN,
  address: DFBOND_ADDRESS,
  abi: DFBondABI,
}) as any;

/* =========================================================================
   Hook
   ========================================================================= */
export const useDFBond = () => {
  /* ---------------- write functions ---------------- */
  const createAndBuy = async (
    name: string,
    symbol: string,
    maxSupply: bigint,
    reserveAmount: bigint
  ) => dfBond.call("createAndBuy", [name, symbol, maxSupply, reserveAmount]);

  const buy = async (
    token: string,
    reserveAmt: bigint,
    minReward: bigint = 0n
  ) => dfBond.call("buy", [token, reserveAmt, minReward]);

  const sell = async (
    token: string,
    amount: bigint,
    minRefund: bigint = 0n
  ) => dfBond.call("sell", [token, amount, minRefund]);

  /* ---------------- read helpers ---------------- */
  const getPrice = async (token: string): Promise<bigint> =>
    dfBond.read("currentPrice", [token]);

  const getMintPreview = async (
    token: string,
    reserveAmt: bigint
  ): Promise<[bigint, bigint]> =>
    dfBond.read("getMintReward", [token, reserveAmt]);

  const getBurnPreview = async (
    token: string,
    amount: bigint
  ): Promise<[bigint, bigint]> =>
    dfBond.read("getBurnRefund", [token, amount]);

  return {
    /* writes */
    createAndBuy,
    buy,
    sell,
    /* reads */
    getPrice,
    getMintPreview,
    getBurnPreview,
  };
};
