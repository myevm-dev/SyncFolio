import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import OfferHeader from "./OfferHeader";
import OfferOptionCard from "./OfferOptionCard";
import SellerProtectionClause from "./SellerProtectionClause";
import SupportingLogicList from "./SupportingLogicList";
import { Pencil } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface OfferModalProps {
  type: "cash" | "sellerFinance" | "takeover" | "hybrid";
  onClose: () => void;
  onSave?: (value: string) => void;
  results: any;
  coc?: any;
  propertyAddress: string;
  walletAddress: string;
}

export default function OfferModal({
  type,
  onClose,
  onSave,
  results,
  coc,
  propertyAddress,
  walletAddress,
}: OfferModalProps) {
  const address = propertyAddress || "[Property Address Here]";
  const [name, setName] = useState("[Your Name]");
  const [phone, setPhone] = useState("[Your Phone Number]");
  const [title, setTitle] = useState("Aquisition Manager");
  const [inspectionDays, setInspectionDays] = useState<number>(7);
  const [jvPartners, setJvPartners] = useState("[Your Company] + [Partner Entity]");
  const offerText = results[type];
  const match = offerText?.match(/\$([0-9,.]+)/);
  const [offerPrice, setOfferPrice] = useState<string>(match?.[1] || "0");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const sellerText = results["sellerFinance"] || "";
  const totalOffer = sellerText.match(/Total Offer: \$(.*)/)?.[1] || "$0";
  const [down, setDown] = useState(sellerText.match(/Down: \$(.*)/)?.[1] || "$0");
  const monthlyMatch = sellerText.match(/Monthly: \$(.*) x (\d+) months/);
  const [monthly, setMonthly] = useState(monthlyMatch?.[1] || "$0");
  const [term, setTerm] = useState(monthlyMatch?.[2] || "0");
  const [balloon, setBalloon] = useState(sellerText.match(/Balloon: \$(.*)/)?.[1] || "$0");

  const handleSave = async () => {
    const content = document.getElementById("offer-preview")?.textContent || "";
    if (!walletAddress) return;
    const ref = collection(db, `users/${walletAddress}/offers`);
    await addDoc(ref, {
      content,
      name,
      phone,
      title,
      propertyAddress: address,
      createdAt: serverTimestamp(),
    });
    if (onSave) onSave(content);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const makeEditableValue = (value: string, onEdit: () => void) => (
    <span>
      {value}
      <Pencil
        size={16}
        className="inline ml-2 cursor-pointer text-blue-400"
        onClick={onEdit}
      />
    </span>
  );

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

        <div
          id="offer-preview"
          className="space-y-6 bg-black text-white p-10 rounded-xl font-serif leading-relaxed"
        >
          <OfferHeader propertyAddress={address} jvPartners={jvPartners} />

          {type === "cash" && (
            <OfferOptionCard
              label="Cash Offer"
              price={Number(offerPrice.replace(/,/g, "")) || 0}
              terms={[
                "Terms: Cash, as-is",
                makeEditableValue(`${inspectionDays} business days`, () => {
                  const input = prompt("Edit number of business days (min 7)", inspectionDays.toString());
                  const num = parseInt(input || "");
                  if (!isNaN(num) && num >= 7) setInspectionDays(num);
                }),
                makeEditableValue(`$${offerPrice}`, () => {
                  const input = prompt("Edit offer price", offerPrice);
                  if (input) setOfferPrice(input);
                }),
                "EMD: $1500 non-refundable, submitted after inspection period",
              ] as unknown as string[]}
            />
          )}

          {type === "sellerFinance" && (
            <>
              <OfferOptionCard
                label="Seller Finance"
                price={Number(totalOffer.replace(/,/g, "")) || 0}
                terms={[
                  makeEditableValue(`$${down}`, () => {
                    const input = prompt("Edit Down Payment", down);
                    if (input) setDown(input);
                  }),
                  makeEditableValue(`$${monthly}`, () => {
                    const input = prompt("Edit Monthly Payment", monthly);
                    if (input) setMonthly(input);
                  }),
                  makeEditableValue(`${term} months`, () => {
                    const input = prompt("Edit Term in months", term);
                    if (input) setTerm(input);
                  }),
                  makeEditableValue(`$${balloon} due in final month`, () => {
                    const input = prompt("Edit Balloon Payment", balloon);
                    if (input) setBalloon(input);
                  }),
                  "Commission: Seller’s agent fee paid from down payment",
                  makeEditableValue(`Subject to a ${inspectionDays} business day inspection period`, () => {
                    const input = prompt("Edit number of business days (min 7)", inspectionDays.toString());
                    const num = parseInt(input || "");
                    if (!isNaN(num) && num >= 7) setInspectionDays(num);
                  }),
                  "EMD: $1,500 non-refundable, submitted after inspection period",
                ] as unknown as string[]}
              />
              <div className="bg-black text-white border border-white p-4 rounded mb-4 text-sm">
                <p>
                  The seller is protected through a <strong>Deed of Trust</strong> and {" "}
                  <strong>Promissory Note</strong>, which include a clause that in the
                  event of two consecutive missed payments, ownership of the property
                  automatically reverts to the seller without the need for judicial
                  foreclosure. All prior payments, improvements, and the down payment
                  would be forfeited to the seller.
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

          <div className="mt-6 text-white text-sm">
            {makeEditableValue(name, () => {
              const input = prompt("Edit Name", name);
              if (input) setName(input);
            })}<br/>
            {makeEditableValue(phone, () => {
              const input = prompt("Edit Phone", phone);
              if (input) setPhone(input);
            })}<br/>
            {makeEditableValue(title, () => {
              const input = prompt("Edit Title", title);
              if (input) setTitle(input);
            })}<br/>
            <p><strong>Attachments:</strong> Proof of Funds, Credibility Packet</p>
          </div>
        </div>

        <div className="pt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleSave}
            className="px-14 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition"
          >
            Save
          </button>

          {saveSuccess && (
            <div className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium">
              Saved to Firebase ✔
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                const textToCopy =
                  document.querySelector("#offer-preview")?.textContent || "";
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
                const pdf = new jsPDF({
                  orientation: "portrait",
                  unit: "px",
                  format: "a4",
                });
                pdf.setFont("Times", "Normal");
                pdf.setFontSize(12);
                pdf.text(textToCopy, 40, 60, {
                  maxWidth: pdf.internal.pageSize.getWidth() - 80,
                  align: "left",
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
