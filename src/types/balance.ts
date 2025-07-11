export type Currency = "usd" | "folio" | "credits";
export type TxnType = "deposit" | "withdrawal" | "transfer";

export interface Transaction {
  type: TxnType;
  amount: number;
  currency: Currency;
  timestamp: any; // Firestore timestamp
  metadata: Record<string, any>;
}
