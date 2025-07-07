import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

export async function generateContractPdf(data: {
  sellerName: string;
  sellerAddress: string;
  buyerName: string;
  buyerAddress: string;
  propertyAddress: string;
  purchasePrice: string;
  earnestMoney: string;
  balanceDue: string;
  closingDate: string;
  dueDiligenceDays: string;
  state: string;
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // standard letter size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width } = page.getSize();
  let y = 750;

  const drawLine = (text: string) => {
    page.drawText(text, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
      lineHeight: 16,
    });
    y -= 22;
  };

  // Title
  page.drawText("REAL ESTATE PURCHASE AND SALE AGREEMENT", {
    x: 50,
    y,
    size: 16,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 40;

  // Sections
  drawLine(`This Agreement is made between:`);
  drawLine(`Seller: ${data.sellerName}, ${data.sellerAddress}`);
  drawLine(`Buyer: ${data.buyerName}, ${data.buyerAddress}`);
  drawLine(`Property Address: ${data.propertyAddress}`);
  drawLine(`Purchase Price: $${data.purchasePrice}`);
  drawLine(`Earnest Money Deposit: $${data.earnestMoney}`);
  drawLine(`Balance Due at Closing: $${data.balanceDue}`);
  drawLine(`Closing Date: ${data.closingDate}`);
  drawLine(`Due Diligence Period: ${data.dueDiligenceDays} business days`);
  drawLine(`Governing Law: State of ${data.state}`);
  y -= 20;

  drawLine("Buyer shall have the right to assign this Agreement.");
  drawLine("Buyer shall have the exclusive right to market the Property.");
  drawLine("If Buyer defaults, Seller may retain the Earnest Money as liquidated damages.");
  drawLine("If Seller defaults, Buyer is entitled to specific performance or full refund.");
  y -= 40;

  // Signature placeholders
  drawLine("SELLER:");
  drawLine("Signature: ________________________");
  drawLine("Printed Name: _____________________");
  drawLine("Date: ________________");
  y -= 40;

  drawLine("BUYER:");
  drawLine("Signature: ________________________");
  drawLine("Printed Name: _____________________");
  drawLine("Date: ________________");

  const pdfBytes = await pdfDoc.save();
  saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "Cash_Contract.pdf");
}
