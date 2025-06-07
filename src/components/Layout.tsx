// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex-grow space-y-8">
        <Outlet />
      </div>
      <div className="mt-20" />
      <Footer />
    </div>
  );
}
