import React, { useState } from "react";
import * as buyboxes from "../buyboxes";
import { BuyBox } from "../types/BuyBox";

const allBuyboxes: { name: string; data: BuyBox[] }[] = [
  { name: "Alabama", data: buyboxes.alabamaBuyboxes },
  { name: "Arizona", data: buyboxes.arizonaBuyboxes },
  { name: "California", data: buyboxes.californiaBuyboxes },
  { name: "Colorado", data: buyboxes.coloradoBuyboxes },
  { name: "Dc", data: buyboxes.dcBuyboxes },
  { name: "Delaware", data: buyboxes.delawareBuyboxes },
  { name: "Florida", data: buyboxes.floridaBuyboxes },
  { name: "Georgia", data: buyboxes.georgiaBuyboxes },
  { name: "Idaho", data: buyboxes.idahoBuyboxes },
  { name: "Indiana", data: buyboxes.indianaBuyboxes },
  { name: "Iowa", data: buyboxes.iowaBuyboxes },
  { name: "Kansas", data: buyboxes.kansasBuyboxes },
  { name: "Louisiana", data: buyboxes.louisianaBuyboxes },
  { name: "Maine", data: buyboxes.maineBuyboxes },
  { name: "Maryland", data: buyboxes.marylandBuyboxes },
  { name: "Massachusetts", data: buyboxes.massachusettsBuyboxes },
  { name: "Minnesota", data: buyboxes.minnesotaBuyboxes },
  { name: "Missouri", data: buyboxes.missouriBuyboxes },
  { name: "Nebraska", data: buyboxes.nebraskaBuyboxes },
  { name: "Nevada", data: buyboxes.nevadaBuyboxes },
  { name: "New Hampshire", data: buyboxes.newhampshireBuyboxes },
  { name: "New Mexico", data: buyboxes.newmexicoBuyboxes },
  { name: "New York", data: buyboxes.newyorkBuyboxes },
  { name: "North Carolina", data: buyboxes.northcarolinaBuyboxes },
  { name: "North Dakota", data: buyboxes.northdakotaBuyboxes },
  { name: "Ohio", data: buyboxes.ohioBuyboxes },
  { name: "Puerto Rico", data: buyboxes.puertoricoBuyboxes },
  { name: "Rhode Island", data: buyboxes.rhodeislandBuyboxes },
  { name: "South Dakota", data: buyboxes.southdakotaBuyboxes },
  { name: "Tennessee", data: buyboxes.tennesseeBuyboxes },
  { name: "Texas", data: buyboxes.texasBuyboxes },
  { name: "Utah", data: buyboxes.utahBuyboxes },
  { name: "Washington", data: buyboxes.washingtonBuyboxes },
  { name: "West Virginia", data: buyboxes.westvirginiaBuyboxes },
  { name: "Wisconsin", data: buyboxes.wisconsinBuyboxes },
  { name: "Wyoming", data: buyboxes.wyomingBuyboxes },
];

const BuyboxCard: React.FC<{ box: BuyBox }> = ({ box }) => (
  <div className="bg-[#1a1a1a] p-4 rounded-md border border-zinc-800 text-sm grid grid-cols-2 gap-4">
    <div>
      <p><strong>City:</strong> {box.city || "-"}</p>
      <p><strong>County:</strong> {box.county || "-"}</p>
      <p><strong>Type:</strong> {box.propertyType}</p>
      <p><strong>Beds Min:</strong> {box.bedMin}</p>
      <p><strong>Baths Min:</strong> {box.bathMin}</p>
      <p><strong>Year Built Min:</strong> {box.yearBuiltMin || "-"}</p>
    </div>
    <div>
      <p><strong>Sqft:</strong> {box.sqftMin} - {box.sqftMax || "Max"}</p>
      <p><strong>ARV % Max:</strong> {box.arvPercentMax || "-"}</p>
      <p><strong>Max Rehab:</strong> {box.maxRehabCost || "-"}</p>
      <p><strong>Max Price:</strong> {box.maxPrice || "-"}</p>
      <p><strong>HOA:</strong> {box.hoa ? "Yes" : "No"}</p>
      <p><strong>Foundation:</strong> {box.foundation || "-"}</p>
    </div>
  </div>
);

const BuyboxDirectory: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="mt-20 bg-[#050505] border border-neutral-700 rounded-lg p-8 shadow-md text-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: "#068989" }}>
        State Buyboxes
      </h2>
      <p className="text-center text-sm text-gray-100 max-w-2xl mx-auto mb-8">
        These buyboxes were submitted by investors targeting specific locations. While highlighting areas of interest,
        creative finance deals can be structured & submitted anywhere with a strong rental market.
      </p>

      <div className="space-y-4">
        {allBuyboxes.map((state, index) => (
          <div key={index} className="border border-zinc-700 bg-[#0B1519] rounded-md overflow-hidden">
            <button
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-[#6e5690] hover:text-black transition"
            >
              <span className="font-semibold">{state.name}</span>
              <span className="text-xl">{activeIndex === index ? "-" : "+"}</span>
            </button>

            {activeIndex === index && (
              <div className="px-4 pb-4 mt-2 space-y-3">
                {state.data.map((box, i) => (
                  <BuyboxCard key={i} box={box} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BuyboxDirectory;