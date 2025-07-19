// src/components/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import TurfNavbar from "./TurfNavbar"; // ✅ Add this import
import Footer from "./Footer";
import UserSearchBar from "./UserSearchBar";

export default function Layout() {
  const location = useLocation();
  const isTurfWars = location.pathname === "/turfwars";

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-[#0B1519]">
        {isTurfWars ? <TurfNavbar /> : <Navbar />}
        {!isTurfWars && <UserSearchBar />}
      </div>

      <main className="flex-grow">
        <Outlet />
      </main>

      {!isTurfWars && <Footer />}
    </div>
  );
}
