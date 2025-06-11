import Marketplace from "../components/Marketplace";

export default function BuyPage() {
  return (
    <div className="min-h-screen w-full bg-[#0B1519] text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Submit your Buybox or Search our Deal Marketplace.
      </h1>
      <p className="text-cyan-400 text-lg mb-10">Coming soon</p>
      <Marketplace />
    </div>
  );
}
