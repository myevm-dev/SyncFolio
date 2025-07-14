// src/hooks/useDFBond.ts
import {
  createThirdwebClient,
  defineChain,
  getContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
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
const MAX_UINT256 = (1n << 256n) - 1n;

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
   ERC‑20 helpers
   ------------------------------------------------------------------*/
const allowanceOf = (owner: string, spender: string) =>
  readContract({
    contract: weth,
    method: "allowance",
    params: [owner, spender],
  }) as Promise<bigint>;

const approveWethTx = (spender: string, amount: bigint) =>
  prepareContractCall({
    contract: weth,
    method: "approve",
    params: [spender, amount],
  });

/* ==================================================================
   Public React hook (safe to call once wallet connects)
   ==================================================================*/
export const useDFBond = () => {
  const account = useActiveAccount();
  const connected = !!account;

  /* ------------- explicit approve step exposed to UI ------------- */
  const approveWeth = async (amount: bigint = MAX_UINT256) => {
    if (!account) throw new Error("Connect wallet first");
    const tx = approveWethTx(DFBOND_ADDRESS, amount);
    const { transactionHash } = await sendTransaction({
      account: account as any,
      transaction: tx,
    });
    await waitForReceipt({ client, chain: BASE_CHAIN, transactionHash });
  };

  const currentAllowance = async (): Promise<bigint> => {
    if (!account) return 0n;
    return await allowanceOf(account.address, DFBOND_ADDRESS);
  };

  /* ------------------------- writes ------------------------------ */
  const createAndBuy = async (
    name: string,
    symbol: string,
    maxSupply: bigint,
    reserveAmount: bigint,
  ) => {
    if (!account) throw new Error("Connect wallet first");

    // 💡 responsibility to have called approve beforehand; we just sanity‑check
    const allowance = await currentAllowance();
    if (allowance < reserveAmount)
      throw new Error("Insufficient WETH allowance – please approve first");

    const tx = prepareContractCall({
      contract: dfBond,
      method: "createAndBuy",
      params: [name, symbol, maxSupply, reserveAmount],
    });
    await sendTransaction({ account: account as any, transaction: tx });
  };

  const buy = async (
    token: string,
    reserveAmt: bigint,
    minReward: bigint = 0n,
  ) => {
    if (!account) throw new Error("Connect wallet first");
    const allowance = await currentAllowance();
    if (allowance < reserveAmt)
      throw new Error("Insufficient WETH allowance – please approve first");
    const tx = prepareContractCall({
      contract: dfBond,
      method: "buy",
      params: [token, reserveAmt, minReward],
    });
    await sendTransaction({ account: account as any, transaction: tx });
  };

  const sell = async (
    token: string,
    amount: bigint,
    minRefund: bigint = 0n,
  ) => {
    if (!account) throw new Error("Connect wallet first");
    const tx = prepareContractCall({
      contract: dfBond,
      method: "sell",
      params: [token, amount, minRefund],
    });
    await sendTransaction({ account: account as any, transaction: tx });
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
    approveWeth,
    currentAllowance,
    createAndBuy,
    buy,
    sell,
    getPrice,
    getMintPreview,
    getBurnPreview,
    MAX_UINT256,
  };
};
