import MyListings from "../components/MyListings";

export default function SellPage() {
  return (
    <div className="min-h-screen w-full bg-[#0B1519] text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Submit your Property Listing or Browse Active Buyers.
      </h1>
    
      <MyListings />
    </div>
  );
}
