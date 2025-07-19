import React, { forwardRef } from "react";

const SyncDispoJVContractPdf = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        lineHeight: "1.6",
        color: "black",
      }}
    >
      <h2 style={{ textAlign: "center", fontWeight: "bold" }}>SYNC DISPO JV AGREEMENT</h2>

      <p>
        This agreement confirms your partnership with Syncfolio for disposition and funding of your real estate deal. If the deal closes, you agree to the following assignment fee distribution:
      </p>

      <ul>
        <li><strong>40%</strong> to <strong>You</strong> (for sourcing the deal)</li>
        <li><strong>40%</strong> to <strong>Syncfolio Dispo</strong> (dispo/funding partner)</li>
        <li><strong>20%</strong> to <strong>Platform</strong> (compliance, infrastructure, admin)</li>
      </ul>

      <p>
        You are guaranteed a minimum payout of <strong>$2,250</strong> or <strong>40% of the total fee</strong>, whichever is greater. You will also receive a bonus of <span style={{ color: "#ff00ff", fontWeight: "bold" }}>50,000 Ꞙolio Tokens</span> upon close.
      </p>

      <p>
        Syncfolio agrees to lead disposition, fund the close if necessary, and handle buyer onboarding and contract execution.
      </p>

      <br /><br />
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>Deal Owner</td>
            <td style={{ width: "10%" }}></td>
            <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>Date</td>
            <td style={{ width: "10%" }}></td>
            <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>Syncfolio</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default SyncDispoJVContractPdf;
