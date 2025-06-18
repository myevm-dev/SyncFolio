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

const TAGS = [
  "🆕 New Buybox",
  "⚡ Fast Response",
  "📈 Active Buyer",
  "🔥 High Demand"
];

const getRandomTags = () => {
  const count = Math.floor(Math.random() * 2) + 1;
  return TAGS.sort(() => 0.5 - Math.random()).slice(0, count);
};

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

export default function BuyboxDirectory() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'state' | 'trending'>('trending');
  const [trendingBoxes, setTrendingBoxes] = useState<BuyBox[]>(getPersistedTrending);
  const [previousBoxes, setPreviousBoxes] = useState<BuyBox[]>(getPreviousTrending);

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
    }, 1000 * 60 * 60 * 12);

    return () => clearInterval(interval);
  }, [trendingBoxes]);

  return (
    <div className="mt-20 max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-4">Buybox Directory</h2>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${viewMode === 'trending' ? 'bg-[#6e5690] text-black' : 'bg-zinc-800 text-white'}`}
          onClick={() => setViewMode('trending')}
        >
          Trending
        </button>
        <button
          className={`px-4 py-2 rounded ${viewMode === 'state' ? 'bg-[#6e5690] text-black' : 'bg-zinc-800 text-white'}`}
          onClick={() => setViewMode('state')}
        >
          State A-Z
        </button>
      </div>

      {viewMode === 'state' ? (
        allBuyboxes.map((state, i) => (
          <div key={i} className="border border-zinc-700 rounded mb-4">
            <button
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              className="w-full px-4 py-3 flex justify-between items-center bg-[#0B1519] hover:bg-[#6e5690] hover:text-black"
            >
              <span className="font-semibold">{state.name}</span>
              <span>{activeIndex === i ? '-' : '+'}</span>
            </button>
            {activeIndex === i && (
              <div className="p-4 space-y-2">
                {state.data.map((box, j) => (
                  <div key={j} className="bg-[#1a1a1a] p-4 rounded border border-zinc-800 text-xs">
                    <div className="grid grid-cols-2 gap-x-4">
                      <div>
                        <p><strong>Type:</strong> {box.propertyType}</p>
                        <p><strong>Beds:</strong> {box.bedMin}</p>
                        <p><strong>Baths:</strong> {box.bathMin}</p>
                        <p><strong>Sqft:</strong> {box.sqftMin} - {box.sqftMax ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p><strong>Max Price:</strong> ${box.maxPrice ?? 'N/A'}</p>
                        <p><strong>Max ARV%:</strong> {box.arvPercentMax ?? 'N/A'}%</p>
                        <p><strong>Max Rehab:</strong> ${box.maxRehabCost ?? 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <>
          <div className="border border-yellow-500 rounded mb-4 p-4 bg-[#1a1a1a] shadow-md">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-bold text-yellow-400">⭐ Promoted - Dallas, Texas</div>
              <span className="text-xs text-yellow-300">Featured Area</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 text-xs text-gray-300">
              <div>
                <p><strong>Type:</strong> single family</p>
                <p><strong>Beds:</strong> 3</p>
                <p><strong>Baths:</strong> 2</p>
                <p><strong>Sqft:</strong> 1200 - 1800</p>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p><strong>Max Price:</strong> $450000</p>
                  <p><strong>Max ARV%:</strong> 70%</p>
                  <p><strong>Max Rehab:</strong> $60000</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2 mt-2">
                  <span className="bg-yellow-900 border border-yellow-600 text-yellow-300 px-2 py-0.5 rounded-full text-xs">
                    🆕 New Buybox
                  </span>
                  <span className="bg-yellow-900 border border-yellow-600 text-yellow-300 px-2 py-0.5 rounded-full text-xs">
                    📈 Active Buyer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {trendingBoxes.slice(0, 20).map((box, i) => {
            const trend = getRankChange(box, i);
            const tags = getRandomTags();
            return (
              <div key={i} className="border border-zinc-700 rounded mb-4 p-4 bg-[#0B1519]">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-semibold text-[#6e5690]">
                    #{i + 1} - {box.city ?? box.county ?? 'Unknown'}, {box.state}
                  </div>
                  <div className="text-xs">
                    {trend === 'up' && '📈'}
                    {trend === 'down' && '📉'}
                    {trend === 'same' && '➖'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 text-xs text-gray-300">
                  <div>
                    <p><strong>Type:</strong> {box.propertyType}</p>
                    <p><strong>Beds:</strong> {box.bedMin}</p>
                    <p><strong>Baths:</strong> {box.bathMin}</p>
                    <p><strong>Sqft:</strong> {box.sqftMin} - {box.sqftMax ?? 'N/A'}</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p><strong>Max Price:</strong> ${box.maxPrice ?? 'N/A'}</p>
                      <p><strong>Max ARV%:</strong> {box.arvPercentMax ?? 'N/A'}%</p>
                      <p><strong>Max Rehab:</strong> ${box.maxRehabCost ?? 'N/A'}</p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2 mt-2">
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-[#1a1a1a] border border-zinc-600 rounded-full px-2 py-0.5 text-white text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
