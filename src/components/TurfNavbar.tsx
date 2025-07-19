import { useNavigate } from "react-router-dom";
import { ConnectButton } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { client } from "../client";

// ✅ No need to import favicon anymore
// Just use the public path for /public/assets/turflogo.png

import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "facebook",
        "telegram",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export default function TurfNavbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="w-full px-3 py-2 flex justify-between items-center border-b border-gray-700"
      style={{ backgroundColor: "#0B1519" }}
    >
      {/* TurfWars Logo */}
      <div
        className="flex items-center gap-2 text-white font-semibold text-lg sm:text-2xl cursor-pointer"
        onClick={() => navigate("/about")}
      >
        <img
          src="/assets/turflogo.png"
          alt="TurfWars logo"
          className="w-10 h-10 sm:w-12 sm:h-12 shrink-0"
        />
        <div className="flex flex-col leading-none">
        <span className="bg-gradient-to-r from-purple-500 to-blue-900 bg-clip-text text-transparent text-xl sm:text-2xl">
            TurfWars
        </span>
        <span className="text-xs text-white opacity-60 ml-[1px]">by SyncFolio</span>
        </div>


      </div>

      {/* Wallet Connect */}
      <div className="shrink-0 scale-90 sm:scale-100 origin-right">
        <ConnectButton
          client={client}
          wallets={wallets}
          chains={[base]}
          chain={base}
          connectModal={{
            size: "compact",
            showThirdwebBranding: false,
          }}
          appMetadata={{
            name: "TurfWars",
            url: "https://myevm.org",
          }}
          connectButton={{
            label: "sign in",
          }}
        />
      </div>
    </nav>
  );
}
