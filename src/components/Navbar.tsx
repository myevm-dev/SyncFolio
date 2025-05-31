import { ConnectButton } from "thirdweb/react";
import { client } from "../client";

export default function Navbar() {
  return (
    <nav
      className="w-full p-4 flex justify-between items-center border-b border-gray-700"
      style={{ backgroundColor: "#0B1519" }}
    >
      <div className="text-lg font-semibold text-white">Syncfolio</div>
      <ConnectButton
        client={client}
        appMetadata={{
          name: "Syncfolio",
          url: "https://myevm.org",
        }}
        connectButton={{
          label: "Sign In",
        }}
      />
    </nav>
  );
}
