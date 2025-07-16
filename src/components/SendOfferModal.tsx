import React, { useState, useRef } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { DealInput } from "../types/DealInput";
import html2pdf from "html2pdf.js";

const ADMIN_NAME = "0xNateZ";
const ADMIN_ADDRESS = "0x91706ECbA7af59616D4005F37979528226532E6B";

declare global {
  interface Window {
    multiavatar: (id: string) => string;
  }
}

interface Props {
  formData: DealInput;
  offerTypes: string[];
  cashOffer: string;
  sellerFinance: {
    price: string;
    down: string;
    monthly: string;
    balloon: string;
  };
  onClose: () => void;
}

export default function SendOfferModal({ formData, offerTypes, cashOffer, sellerFinance, onClose }: Props) {
  const [certified, setCertified] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);
  const hiddenContentRef = useRef<HTMLDivElement>(null);

  const getAvatarSvg = () => {
    return window.multiavatar(`${ADMIN_NAME}-${ADMIN_ADDRESS}`);
  };

  const handleNotify = () => {
    console.log("Sending offer data to admin:", formData);
    alert("Offer sent to admin!");
    setHasNotified(true);
  };

  const handleDownload = () => {
    if (!certified || !hasNotified) return;
    if (hiddenContentRef.current) {
      html2pdf().from(hiddenContentRef.current).save(`${formData.address || "offer"}.pdf`);
    }
    onClose();
  };

  const renderOffers = () => {
    const sections = [];
    if (offerTypes.includes("cash")) {
      sections.push(
        `<p><strong>💵 Cash Offer</strong><br />
        Property Address: ${formData.address}<br />
        After Repair Value (ARV): $${formData.arv}<br />
        Estimated Rehab: $${formData.rehabCost}<br />
        Offer Price Estimate: $${cashOffer}<br /><br />
        Terms:<br />
        - Standard 30 day close<br />
        - 7-day inspection period<br />
        - Buyer may utilize financing or private capital<br />
        - Property to be purchased as-is<br />
        - Buyer may cover standard closing costs</p>`
      );
    }
    if (offerTypes.includes("seller")) {
      sections.push(
        `<p><strong>🤝 Seller Finance Offer</strong><br />
        Property Address: ${formData.address}<br />
        Price: $${sellerFinance.price}<br />
        Down Payment: $${sellerFinance.down}<br />
        Monthly: $${sellerFinance.monthly}<br />
        Balloon Payment (8 yrs): $${sellerFinance.balloon}</p>`
      );
    }
    return sections.join("<br /><br />");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div
        id="send-offer-modal-content"
        className="bg-[#0B1519] border border-neutral-700 text-white rounded-xl shadow-2xl p-6 max-w-2xl w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-500 hover:text-red-600"
        >
          <XCircleIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Notify <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">0xNateZ</span> and Download Offer
        </h2>

        <div className="mb-6 border border-neutral-700 rounded-md p-4 bg-[#050505] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: getAvatarSvg(),
              }}
            />
            <div>
              <p className="text-sm font-semibold text-white">{ADMIN_NAME}</p>
              <p className="text-xs text-gray-400">
                {ADMIN_ADDRESS.slice(0, 6)}...{ADMIN_ADDRESS.slice(-4)}
              </p>
            </div>
          </div>

          <button
            onClick={handleNotify}
            className="text-xs px-3 py-1 rounded text-white bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
          >
            Notify
          </button>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-300 mb-4">
          <input
            type="checkbox"
            id="certify"
            checked={certified}
            onChange={(e) => setCertified(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="certify">
            I certify that this information is accurate to the best of my knowledge.
          </label>
        </div>

        <button
          disabled={!certified || !hasNotified}
          onClick={handleDownload}
          className={`w-full px-4 py-2 font-semibold rounded shadow-md transition ${
            certified && hasNotified
              ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-black"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Download
        </button>

        {/* Hidden content for PDF generation */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <div
            ref={hiddenContentRef}
            style={{
              padding: "24px",
              backgroundColor: "white",
              color: "black",
              maxWidth: "650px",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
              lineHeight: "1.6"
            }}
          >
            <p>Hi {formData.agentName},</p>

            <p>Thanks for sharing details on this property. Based on the current information provided, here’s a preliminary offer:</p>

            {offerTypes.length > 0 && (
              <>
                <br />
                <div dangerouslySetInnerHTML={{ __html: renderOffers() }} />
                <br /><br />
              </>
            )}

            <p>This offer is based on the information currently available. We’ll follow up to confirm key details (condition, rentability, access, title, etc.). If everything checks out, we’re prepared to move quickly and finalize a contract.</p>

            <p>Let me know how best to proceed, and thanks again.</p>

            <p>—<br />Your Name<br />Nate Z<br />909-667-0805</p>
          </div>
        </div>
      </div>
    </div>
  );
}