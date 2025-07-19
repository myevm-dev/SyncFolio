import React, { forwardRef } from "react";

const AuctionJVContractPdf = forwardRef<HTMLDivElement>((props, ref) => {
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
        Business Day Joint Venture Option Contract
      </h2>

      <p>
        Received from: __________________ (Buyer/JV Partner), the sum of $10.00
        Shown by:
      </p>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        <li>Cash, <strong>X</strong></li>
        <li>Cashier’s Check, ___</li>
        <li>Personal Check, or Other ____</li>
      </ul>

      <p>
        Payable to __________________ (Seller/Contract Holder), to be held
        uncashed until this option is accepted as deposit.
      </p>

      <p>
        Toward the price of: () _______________________________
      </p>

      <p>
        1) Property: Seller/Contract Holder hereby gives and grants to
        Buyer/JV Partner and/or assignees for a period of 30 business days from
        the date hereof, the <strong>exclusive</strong> right and privilege of
        purchasing the following described real property located at:
      </p>

      <p><strong>Property Address:</strong> _____________________________</p>

      <p>
        2) Seller/Contract Holder Agrees to a ___/___ split of proceeds over and
        above sales price with Buyer/JV Partner.
      </p>

      <p>
        This is a legal and binding contract and has been thoroughly reviewed by
        both parties.
      </p>

      <br /><br />

      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td style={{ borderTop: "1px solid #000", width: "60%", textAlign: "center" }}>
              Seller/Contract Holder
            </td>
            <td style={{ width: "10%" }}></td>
            <td style={{ textAlign: "center" }}>By:</td>
          </tr>
          <tr>
            <td style={{ height: "40px" }}></td>
          </tr>
          <tr>
            <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>
              ______________________
            </td>
            <td style={{ width: "10%" }}></td>
            <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>
              Date
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default AuctionJVContractPdf;
