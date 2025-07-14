// src/hooks/useDFBond.ts
import {
  createThirdwebClient,
  defineChain,
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
} from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { DFBondABI } from "../lib/DFBondABI";
import { ERC20_ABI } from "../lib/ERC20_ABI";

/* ------------------------------------------------------------------
   Thirdweb client & chain setup
   ------------------------------------------------------------------*/
const client = createThirdwebClient({
  clientId: import.meta.env.VITE_TEMPLATE_CLIENT_ID,
});

const BASE_CHAIN = defineChain(8453); // Base main‑net
export const DFBOND_ADDRESS =
  "0x2681D784e42AEA9eCe5fC3D5D6C05BE5199807F2" as const;
const WETH_ADDRESS =
  "0x4200000000000000000000000000000000000006" as const; // canonical WETH on Base

/* ------------------------------------------------------------------
   Contract handles (ABI casted to any – avoids deep generic gymnastics)
   ------------------------------------------------------------------*/
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
  abi: ERC20_ABI as any,
});

/* ------------------------------------------------------------------
   Helper – give DFBond permission to pull WETH
   ------------------------------------------------------------------*/
// helper – approve the DFBond contract to spend user's WETH
const approveWeth = async (
  account: any,
  spender: string,
  amount: bigint,
) => {
  const tx = prepareContractCall({
    contract: weth,
    method: "approve",
    params: [spender, amount],
  });
  await sendTransaction({ account, transaction: tx });
};

/* ==================================================================
   Public React hook (safe to call before wallet connects)
   ==================================================================*/
export const useDFBond = () => {
  const activeAccount = useActiveAccount();
  const connected = !!activeAccount;

  /* ------------------------- writes ------------------------------ */
  const createAndBuy = async (
    name: string,
    symbol: string,
    maxSupply: bigint,
    reserveAmount: bigint,
  ) => {
    if (!activeAccount) throw new Error("Connect wallet first");
    await approveWeth(activeAccount, DFBOND_ADDRESS, reserveAmount);
    const tx = prepareContractCall({
      contract: dfBond,
      method: "createAndBuy",
      params: [name, symbol, maxSupply, reserveAmount],
    });
    await sendTransaction({ account: activeAccount as any, transaction: tx });
  };

  const buy = async (
    token: string,
    reserveAmt: bigint,
    minReward: bigint = 0n,
  ) => {
    if (!activeAccount) throw new Error("Connect wallet first");
    await approveWeth(activeAccount, DFBOND_ADDRESS, reserveAmt);
    const tx = prepareContractCall({
      contract: dfBond,
      method: "buy",
      params: [token, reserveAmt, minReward],
    });
    await sendTransaction({ account: activeAccount as any, transaction: tx });
  };

  const sell = async (
    token: string,
    amount: bigint,
    minRefund: bigint = 0n,
  ) => {
    if (!activeAccount) throw new Error("Connect wallet first");
    const tx = prepareContractCall({
      contract: dfBond,
      method: "sell",
      params: [token, amount, minRefund],
    });
    await sendTransaction({ account: activeAccount as any, transaction: tx });
  };

  /* ------------------------- reads ------------------------------- */
  const getPrice = (token: string) =>
    readContract({
      contract: dfBond,
      method: "currentPrice",
      params: [token],
    }) as Promise<bigint>;

  const getMintPreview = (token: string, reserveAmt: bigint) =>
    readContract({
      contract: dfBond,
      method: "getMintReward",
      params: [token, reserveAmt],
    }) as Promise<[bigint, bigint]>;

  const getBurnPreview = (token: string, amount: bigint) =>
    readContract({
      contract: dfBond,
      method: "getBurnRefund",
      params: [token, amount],
    }) as Promise<[bigint, bigint]>;

  return {
    connected,
    createAndBuy,
    buy,
    sell,
    getPrice,
    getMintPreview,
    getBurnPreview,
  };
};
