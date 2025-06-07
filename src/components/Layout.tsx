import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-[#0B1519]">
        <Navbar />
      </div>
      <main className="flex-grow">
        <Outlet />
      </main>
      
    </div>
  );
}
