// components/Footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer
      className="w-full p-4 text-center text-sm border-t border-gray-700"
      style={{ backgroundColor: "#0B1519" }}
    >
      <p className="text-gray-400">
        Version 0.7.7 —{" "}
        <a
          href="https://myevm.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          by MyEVM
        </a>
      </p>
    </footer>
  );
}
