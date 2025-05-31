import { ConnectButton } from "thirdweb/react";
import favicon from "../favicon.png";
import { client } from "../client"; // adjust path if needed
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

export default function Navbar() {
  return (
    <nav
      className="w-full p-4 flex justify-between items-center border-b border-gray-700"
      style={{ backgroundColor: "#0B1519" }}
    >
      <div className="flex items-center gap-2 text-white font-semibold text-2xl">
        <img src={favicon} alt="logo" className="w-12 h-12" />
        Syncfolio
      </div>
      <ConnectButton
        client={client}
        wallets={wallets}
        connectModal={{
          size: "compact",
          showThirdwebBranding: false,
        }}
        appMetadata={{
          name: "Syncfolio",
          url: "https://myevm.org",
        }}
        connectButton={{
          label: "sign in",
        }}
      />
    </nav>
  );
}
