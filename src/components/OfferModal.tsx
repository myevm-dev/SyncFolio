import React from "react";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import OfferHeader from "./OfferHeader";
import OfferOptionCard from "./OfferOptionCard";
import SellerProtectionClause from "./SellerProtectionClause";
import SupportingLogicList from "./SupportingLogicList";
import OfferFooter from "./OfferFooter";

interface OfferModalProps {
  type: "cash" | "sellerFinance" | "takeover" | "hybrid";
  onClose: () => void;
  onSave?: (value: string) => void;
}

export default function OfferModal({ type, onClose, onSave }: OfferModalProps) {
  const defaultAddress = "[Property Address Here]";
  const defaultJVPartners = "[Your Company] + [Partner Entity]";
  const defaultName = "[Your Name]";
  const defaultPhone = "[Your Phone Number]";

  const handleSave = () => {
    const content = document.getElementById("offer-preview")?.textContent || "";
    if (onSave) onSave(content);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-black text-white w-full max-w-2xl p-6 rounded-xl mx-auto">
        <DialogTitle className="text-2xl font-bold text-center text-white mb-6">
          {type === "cash"
            ? "Cash Offer"
            : type === "sellerFinance"
            ? "Seller Finance Offer"
            : "Offer Preview"}
        </DialogTitle>

        <div id="offer-preview" className="space-y-6 bg-black text-white p-10 rounded-xl font-serif leading-relaxed">
          <OfferHeader
            propertyAddress={defaultAddress}
            jvPartners={defaultJVPartners}
          />

          {type === "cash" && (
            <OfferOptionCard
              label="Cash Offer"
              price={0}
              terms={[
                "Terms: Cash, as-is",
                "Close: Subject to a 7 business day inspection period",
                "EMD: $1,500 non-refundable, submitted after inspection period",
              ]}
            />
          )}

          {type === "sellerFinance" && (
            <>
              <OfferOptionCard
                label="Seller Finance"
                price={0}
                terms={[
                  "Down Payment: $X,XXX",
                  "Monthly Payment: $XXX",
                  "Term: XX months",
                  "Balloon: $X,XXX due in final month",
                  "Commission: Seller’s agent fee paid from down payment",
                  "Close: Subject to a 7 business day inspection period",
                  "EMD: $1,500 non-refundable, submitted after inspection period",
                ]}
              />
              <div className="bg-black text-white border border-white p-4 rounded mb-4 text-sm">
                <p>
                  The seller is protected through a <strong>Deed of Trust</strong> and <strong>Promissory Note</strong>, which include a clause that in the event of two consecutive missed payments, ownership of the property automatically reverts to the seller without the need for judicial foreclosure. All prior payments, improvements, and the down payment would be forfeited to the seller.
                </p>
              </div>
            </>
          )}

          <SupportingLogicList
            bullets={[
              "Point One",
              "Point Two",
              "Point Three",
              "Point Four",
              "Point Five",
            ]}
          />

          <OfferFooter
            contact={{
              name: defaultName,
              phone: defaultPhone,
              jv: defaultJVPartners,
            }}
            attachments={["Proof of Funds", "Credibility Packet"]}
          />
        </div>

        <div className="pt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleSave}
            className="px-14 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition"
          >
            Save
          </button>

          <div className="flex flex-wrap justify-center gap-3">

            <button
              onClick={() => {
                const textToCopy = document.querySelector("#offer-preview")?.textContent || "";
                navigator.clipboard.writeText(textToCopy);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Copy Text
            </button>

            <button
              onClick={async () => {
                const element = document.getElementById("offer-preview");
                if (!element) return;

                const jsPDF = (await import("jspdf")).jsPDF;
                const textToCopy = element.innerText;
                const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
                pdf.setFont("Times", "Normal");
                pdf.setFontSize(12);
                pdf.text(textToCopy, 40, 60, {
                  maxWidth: pdf.internal.pageSize.getWidth() - 80,
                  align: "left"
                });
                pdf.save("offer.pdf");
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Download All
            </button>

            <button
              onClick={() => {
                const content = encodeURIComponent(
                  document.getElementById("offer-preview")?.textContent || ""
                );
                const shareUrl = `mailto:?subject=Offer Preview&body=${content}`;
                window.open(shareUrl, "_blank");
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
            >
              Create Link
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
