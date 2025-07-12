// components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="w-full p-4 text-center text-sm border-t border-gray-700"
      style={{ backgroundColor: "#0B1519" }}
    >
      <p className="text-gray-400 mb-2">
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

      {/* Temporary DealFlow button */}
      <Link
        to="/dealflow"
        className="inline-block px-4 py-2 mt-2 text-xs font-semibold text-white bg-cyan-600 rounded hover:bg-cyan-700 transition"
      >
        Open DealFlow Map
      </Link>
    </footer>
  );
}
