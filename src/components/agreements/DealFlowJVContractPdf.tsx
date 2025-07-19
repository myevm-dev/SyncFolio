import React, { forwardRef } from "react";

const DealFlowJVContractPdf = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        lineHeight: "1.6",
        color: "black",
        width: "100%",
      }}
    >
      <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
        Internal Deal Flow JV Agreement
      </h2>

      <p>
        This agreement is made between the Deal Owner ("You") and Syncfolio for
        the distribution of the following real estate investment opportunity:
      </p>

      <p>
        <strong>Property Address:</strong> _____________________________
      </p>

      <p>
        Under this agreement, Syncfolio will distribute this deal to its internal
        network of vetted buyers and manage related paperwork and compliance.
      </p>

      <p>
        <strong>Fee Distribution:</strong>
      </p>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        <li>
          • <span style={{ fontWeight: "bold", color: "#06b6d4" }}>80%</span> to you (Deal
          Owner)
        </li>
        <li>
          • <span style={{ fontWeight: "bold", color: "#facc15" }}>20%</span> to Syncfolio (Compliance + Infrastructure)
        </li>
      </ul>

      <p>
        Both parties agree to act in good faith and transparency during the
        assignment and closing process.
      </p>

      <br /><br />

      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td
              style={{
                borderTop: "1px solid #000",
                width: "30%",
                textAlign: "center",
              }}
            >
              Deal Owner
            </td>
            <td style={{ width: "10%" }}></td>
            <td
              style={{
                borderTop: "1px solid #000",
                width: "30%",
                textAlign: "center",
              }}
            >
              Syncfolio Rep
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default DealFlowJVContractPdf;
