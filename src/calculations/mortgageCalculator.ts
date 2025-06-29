export interface MortgageInput {
  listingPrice: number;
  downPaymentPercent?: number; // default = 20
  interestRate?: number;       // default = 7
  loanTermYears?: number;      // default = 30
}

export interface MortgageResult {
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

export function calculateMortgage({
  listingPrice,
  downPaymentPercent = 20,
  interestRate = 7,
  loanTermYears = 30,
}: MortgageInput): MortgageResult {
  const downPayment = (listingPrice * downPaymentPercent) / 100;
  const loanAmount = listingPrice - downPayment;

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTermYears * 12;

  const monthlyPayment =
    loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalPaid = monthlyPayment * totalMonths;
  const totalInterest = totalPaid - loanAmount;

  return {
    downPayment,
    loanAmount,
    monthlyPayment,
    totalPaid,
    totalInterest,
  };
}
