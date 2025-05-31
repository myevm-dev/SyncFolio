import { ConnectButton } from "thirdweb/react";
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
      <div className="text-lg font-semibold text-white">
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
