export interface CashOnCashResult {
  type: string;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCash: number;
  entry: number;
  pass: boolean;
  monthlyPayment: number; // 👈 Add this line
}
