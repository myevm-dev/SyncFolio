import React from "react";
import { DealInput } from "../../types/DealInput";

interface Props {
  formData: DealInput;
  renderField: (name: keyof DealInput, label: string, span?: number) => JSX.Element;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

export default function MortgageSection({ formData, renderField, handleChange }: Props) {
  return (
    <>
      <h2 className="text-center text-xl font-semibold text-[#6e5690] mt-8">Is there a Mortgage?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {renderField("loanAmount", "Original Loan Amount")}
        {renderField("mortgageBalance", "Outstanding Mortgage Balance")}
        {renderField("interestRate", "Mortgage Interest Rate")}
        {renderField("loanPayment", "Monthly Loan Payment")}
      </div>
    </>
  );
}
