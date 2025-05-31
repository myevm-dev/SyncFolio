import { ConnectButton } from "thirdweb/react";
import { client } from "../client"; // adjust if your path differs

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-900 p-4 flex justify-between items-center border-b border-gray-700">
      <div className="text-lg font-semibold text-white">
        Syncfolio
      </div>
      <ConnectButton
        client={client}
        appMetadata={{
          name: "Syncfolio",
          url: "https://myevm.org", // replace with your deployed app URL
        }}
      />
    </nav>
  );
}
