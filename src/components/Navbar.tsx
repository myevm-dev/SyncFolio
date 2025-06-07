import { useState } from "react";
import { ConnectButton } from "thirdweb/react";
import { useLocation, useNavigate } from "react-router-dom";
import favicon from "../favicon.png";
import { client } from "../client";
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

const pageLabels: Record<string, string> = {
  "/": "Home",
  "/profile": "Profile",
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentPath = location.pathname;
  const currentLabel = pageLabels[currentPath] || "Page";

  const handleNavigate = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Top Nav */}
      <nav
        className="w-full px-3 py-2 flex justify-between items-center border-b border-gray-700"
        style={{ backgroundColor: "#0B1519" }}
      >
        {/* Logo + Brand */}
        <div
          className="flex items-center gap-2 text-white font-semibold text-lg sm:text-2xl truncate cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={favicon} alt="logo" className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
          <span className="truncate max-w-[40vw] sm:max-w-none">SyncFolio</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-4 items-center text-white font-medium">
          {Object.entries(pageLabels).map(([path, label]) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`hover:text-accent transition ${
                currentPath === path ? "text-accent font-bold" : "text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Wallet Connect */}
        <div className="ml-2 sm:ml-4 shrink-0 scale-90 sm:scale-100 origin-right">
          <ConnectButton
            client={client}
            wallets={wallets}
            connectModal={{
              size: "compact",
              showThirdwebBranding: false,
            }}
            appMetadata={{
              name: "SyncFolio",
              url: "https://myevm.org",
            }}
            connectButton={{
              label: "sign in",
            }}
          />
        </div>
      </nav>

      {/* Mobile Drop-Up Menu */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0B1519] border-t border-gray-700 md:hidden z-50">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full py-3 text-sm font-semibold text-white"
        >
          {currentLabel} ▴
        </button>

        {menuOpen && (
          <div className="bg-[#0B1519] border-t border-gray-700 text-white text-sm">
            {Object.entries(pageLabels).map(([path, label]) => (
              <button
                key={path}
                onClick={() => handleNavigate(path)}
                className="w-full text-left px-4 py-3 hover:bg-[#044a4b] transition"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
