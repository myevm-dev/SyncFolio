import React, { useState } from "react";
import * as buyboxes from "../buyboxes";

type BuyBox = {
  cities: string[];
  county?: string;
  propertyType: string;
  bedMin: number;
  bathMin: number;
  yearBuiltMin?: number;
  sqftMin: number;
  sqftMax?: number;
  arvPercentMax?: number;
  maxRehabCost?: number;
  maxPrice?: number;
  hoa?: boolean;
  foundation?: string;
};

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

const BuyboxDirectory: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="mt-20 bg-[#050505] border border-neutral-700 rounded-lg p-8 shadow-md hover:shadow-lg transition text-white">
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
              onClick={() => handleToggle(index)}
              className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-[#6e5690] hover:text-black transition"
            >
              <span className="font-semibold">{state.name}</span>
              <span className="text-xl">{activeIndex === index ? "-" : "+"}</span>
            </button>

            {activeIndex === index && (
              <div className="px-4 pb-4 mt-2 text-sm text-gray-300 space-y-2">
                {state.data.map((box: BuyBox, i: number) => (
                  <pre
                    key={i}
                    className="bg-[#1a1a1a] p-3 rounded text-xs whitespace-pre-wrap border border-zinc-800"
                  >
                    {JSON.stringify(box, null, 2)}
                  </pre>
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
