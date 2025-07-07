import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

export async function generateContractPdf(data: any) {
  const templateBytes = await fetch("/REAL ESTATE PURCHASE AND SALE AGREEMENT_Template (2).pdf")
    .then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const page = pages[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = 650;

  const drawText = (text: string, x: number, y: number) => {
    page.drawText(text, {
      x,
      y,
      size: 11,
      font,
      color: rgb(0, 0, 0),
    });
  };

  // Example positions (adjust as needed to match your template layout)
  drawText(data.sellerName, 100, y);
  drawText(data.sellerAddress, 100, y - 20);
  drawText(data.buyerName, 100, y - 40);
  drawText(data.buyerAddress, 100, y - 60);
  drawText(data.propertyAddress, 100, y - 80);
  drawText(`$${data.purchasePrice}`, 100, y - 100);
  drawText(`$${data.earnestMoney}`, 100, y - 120);
  drawText(`$${data.balanceDue}`, 100, y - 140);
  drawText(data.closingDate, 100, y - 160);
  drawText(`${data.dueDiligenceDays} days`, 100, y - 180);
  drawText(`State of ${data.state}`, 100, y - 200);

  const pdfBytes = await pdfDoc.save();
  saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "Cash_Contract.pdf");
}
