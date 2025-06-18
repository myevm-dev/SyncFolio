import React, { useState, useEffect } from "react";
import * as buyboxes from "../buyboxes";

export interface BuyBox {
  cities?: string[];
  city?: string;
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
  state?: string;
}

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
  { name: "Wyoming", data: buyboxes.wyomingBuyboxes }
];

const flattenBuyboxes = allBuyboxes.flatMap(state =>
  state.data.map(b => ({ ...b, state: state.name }))
);

const shuffleArray = (arr: any[]) => {
  const preserved = arr.slice(0, 5);
  const shuffledRest = [...arr.slice(5)].sort(() => 0.5 - Math.random());
  return [...preserved, ...shuffledRest];
};

const getPersistedTrending = () => {
  const stored = localStorage.getItem("trendingBuyboxes");
  if (stored) return JSON.parse(stored);
  const shuffled = shuffleArray(flattenBuyboxes);
  localStorage.setItem("trendingBuyboxes", JSON.stringify(shuffled));
  return shuffled;
};

const getPreviousTrending = () => {
  const stored = localStorage.getItem("previousTrendingBuyboxes");
  return stored ? JSON.parse(stored) : [];
};

const BuyboxDirectory: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [view, setView] = useState<'state' | 'trending'>('state');
  const [trendingBoxes, setTrendingBoxes] = useState<BuyBox[]>(getPersistedTrending);
  const [previousBoxes, setPreviousBoxes] = useState<BuyBox[]>(getPreviousTrending);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const getRankChange = (box: BuyBox, currentIndex: number) => {
    const id = `${box.city}-${box.state}`;
    const prevIndex = previousBoxes.findIndex(b => `${b.city}-${b.state}` === id);
    if (prevIndex === -1) return null;
    if (prevIndex > currentIndex) return 'up';
    if (prevIndex < currentIndex) return 'down';
    return 'same';
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const prev = trendingBoxes;
      const shuffled = shuffleArray(flattenBuyboxes);
      setTrendingBoxes(shuffled);
      setPreviousBoxes(prev);
      localStorage.setItem("trendingBuyboxes", JSON.stringify(shuffled));
      localStorage.setItem("previousTrendingBuyboxes", JSON.stringify(prev));
    }, 1000 * 60 * 60 * 1);

    return () => clearInterval(interval);
  }, [trendingBoxes]);

  return (
    <section className="mt-20 bg-[#050505] border border-neutral-700 rounded-lg p-8 shadow-md hover:shadow-lg transition text-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: "#068989" }}>
        State Buyboxes
      </h2>
      <div className="flex justify-center mb-6 space-x-2">
        <button
          className={`px-4 py-1 rounded-full text-sm ${view === 'state' ? 'bg-[#6e5690] text-black' : 'bg-zinc-800 text-white'}`}
          onClick={() => setView('state')}
        >
          State A-Z
        </button>
        <button
          className={`px-4 py-1 rounded-full text-sm ${view === 'trending' ? 'bg-[#6e5690] text-black' : 'bg-zinc-800 text-white'}`}
          onClick={() => setView('trending')}
        >
          Trending
        </button>
      </div>

      <p className="text-center text-sm text-gray-100 max-w-2xl mx-auto mb-8">
        These buyboxes were submitted by investors targeting specific locations. While highlighting areas of interest,
        creative finance deals can be structured & submitted anywhere with a strong rental market.
      </p>

      <div className="space-y-4">
        {view === 'state' ? (
          allBuyboxes.map((state, index) => (
            <div key={index} className="border border-zinc-700 bg-[#0B1519] rounded-md overflow-hidden">
              <button
                onClick={() => handleToggle(index)}
                className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-[#6e5690] hover:text-black transition"
              >
                <span className="font-semibold">{state.name}</span>
                <span className="text-xl">{activeIndex === index ? "-" : "+"}</span>
              </button>
              {activeIndex === index && (
                <div className="px-4 pb-4 mt-2 text-sm text-gray-300 space-y-4">
                  {state.data.map((box: BuyBox, i: number) => (
                    <div
                      key={i}
                      className="bg-[#1a1a1a] p-4 rounded border border-zinc-800 grid grid-cols-2 gap-x-4 text-xs"
                    >
                      <div>
                        <p><strong>Property Type:</strong> {box.propertyType}</p>
                        <p><strong>Bedrooms:</strong> {box.bedMin}</p>
                        <p><strong>Bathrooms:</strong> {box.bathMin}</p>
                        <p><strong>Sqft Min:</strong> {box.sqftMin}</p>
                        <p><strong>Sqft Max:</strong> {box.sqftMax ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p><strong>Max Price:</strong> ${box.maxPrice ?? 'N/A'}</p>
                        <p><strong>ARV % Max:</strong> {box.arvPercentMax ?? 'N/A'}%</p>
                        <p><strong>Max Rehab:</strong> ${box.maxRehabCost ?? 'N/A'}</p>
                        <p><strong>HOA Allowed:</strong> {box.hoa ? 'Yes' : 'No'}</p>
                        <p><strong>Foundation:</strong> {box.foundation ?? 'Any'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          trendingBoxes.slice(0, 20).map((box, index) => {
            const rankChange = getRankChange(box, index);
            return (
              <div key={index} className="border border-zinc-700 bg-[#0B1519] rounded-md p-4">
                <div className="text-sm font-semibold mb-2 text-[#6e5690]">
                  #{index + 1} - {box.city ?? box.county ?? box.state} ({box.state}){' '}
                  <span className="ml-2 text-xs">
                    {rankChange === 'up' && '📈'}
                    {rankChange === 'down' && '📉'}
                    {rankChange === 'same' && '➖'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 text-xs text-gray-300">
                  <div>
                    <p><strong>Property Type:</strong> {box.propertyType}</p>
                    <p><strong>Bedrooms:</strong> {box.bedMin}</p>
                    <p><strong>Bathrooms:</strong> {box.bathMin}</p>
                    <p><strong>Sqft Min:</strong> {box.sqftMin}</p>
                    <p><strong>Sqft Max:</strong> {box.sqftMax ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Max Price:</strong> ${box.maxPrice ?? 'N/A'}</p>
                    <p><strong>ARV % Max:</strong> {box.arvPercentMax ?? 'N/A'}%</p>
                    <p><strong>Max Rehab:</strong> ${box.maxRehabCost ?? 'N/A'}</p>
                    <p><strong>HOA Allowed:</strong> {box.hoa ? 'Yes' : 'No'}</p>
                    <p><strong>Foundation:</strong> {box.foundation ?? 'Any'}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default BuyboxDirectory;