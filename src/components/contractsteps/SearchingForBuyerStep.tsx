import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useActiveAccount } from "thirdweb/react";
import html2pdf from "html2pdf.js";

interface Props {
  index: number;
}

export default function SearchingForBuyerStep({ index }: Props) {
  const { id: contractId } = useParams();
  const account = useActiveAccount();
  const walletAddress = account?.address;
  const [inspectionEndsAt, setInspectionEndsAt] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pdfExtendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInspectionTime = async () => {
      if (!walletAddress || !contractId) return;
      const ref = doc(db, `users/${walletAddress}/contracts/${contractId}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.inspectionEndsAt) {
          setInspectionEndsAt(data.inspectionEndsAt);
        }
      }
    };
    fetchInspectionTime();
  }, [walletAddress, contractId]);

  useEffect(() => {
    if (!inspectionEndsAt) return;

    const interval = setInterval(() => {
      const end = new Date(inspectionEndsAt).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setCountdown("Inspection period ended.");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s remaining`);
    }, 1000);

    return () => clearInterval(interval);
  }, [inspectionEndsAt]);

  const handleCancelContract = () => {
    if (!pdfContainerRef.current) return;
    html2pdf()
      .from(pdfContainerRef.current)
      .save("Contract_Termination.pdf");
  };

  const handleExtendContract = () => {
    if (!pdfExtendRef.current) return;
    html2pdf()
      .from(pdfExtendRef.current)
      .save("Inspection_Extension.pdf");
  };

  if (index < 4) return null;

  return (
    <>
      <div className="w-[250px] md:w-[440px] bg-black border border-cyan-500 rounded-xl p-6 shadow-md flex flex-col justify-between text-center">
        <p className="text-white font-semibold text-lg mb-2">Inspection Countdown</p>
        <p className="text-cyan-400 text-sm mb-4">{countdown || "Loading..."}</p>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleCancelContract}
            className="flex-1 py-1 text-sm rounded-full text-black bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          >
            Cancel Contract
          </button>
          <button
            onClick={handleExtendContract}
            className="flex-1 py-1 text-sm rounded-full text-black bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            Extend Inspection
          </button>
        </div>
      </div>

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={pdfContainerRef} style={{ padding: "24px", fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: "1.6", color: "black" }}>
          <h2 style={{ textAlign: "center", fontWeight: "bold" }}>NOTICE OF BUYER'S TERMINATION OF CONTRACT</h2>
          <p style={{ textAlign: "center" }}>CONCERNING THE CONTRACT FOR THE SALE OF THE PROPERTY AT</p>
          <hr />
          <p style={{ textAlign: "center" }}>BETWEEN THE UNDERSIGNED BUYER AND</p>
          <hr />
          <p style={{ textAlign: "center" }}>(SELLER)</p>

          <p>Buyer notifies Seller that the contract is terminated pursuant to the following:</p>

          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            <li>☑ (1) The unrestricted right of the buyer to terminate the contract under Paragraph 7 of the contract</li>
          </ul>

          <p><strong>NOTE:</strong> Release of the earnest money is governed by the terms of the contract.</p>

          <br/><br/><br/>

          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>Buyer</td>
                <td style={{ width: "10%" }}></td>
                <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>Date</td>
                <td style={{ width: "10%" }}></td>
                <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>Seller</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div ref={pdfExtendRef} style={{ padding: "24px", fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: "1.6", color: "black" }}>
          <h2 style={{ textAlign: "center", fontWeight: "bold" }}>BUYER'S REQUEST TO EXTEND INSPECTION PERIOD</h2>
          <p style={{ textAlign: "center" }}>CONCERNING THE CONTRACT FOR THE SALE OF THE PROPERTY AT</p>
          <hr />
          <p style={{ textAlign: "center" }}>BETWEEN THE UNDERSIGNED BUYER AND</p>
          <hr />
          <p style={{ textAlign: "center" }}>(SELLER)</p>

          <p>Buyer respectfully requests an extension of the inspection period for an additional 7 days beyond the current agreed timeline. This extension will allow for further due diligence and coordination as required.</p>

          <p>Please confirm acceptance of this extension in writing.</p>

          <br/><br/><br/>

          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>Buyer</td>
                <td style={{ width: "10%" }}></td>
                <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>Date</td>
                <td style={{ width: "10%" }}></td>
                <td style={{ borderTop: "1px solid #000", width: "30%", textAlign: "center" }}>Seller</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}