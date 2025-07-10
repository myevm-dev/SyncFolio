import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import UserSearchBar from "./UserSearchBar";


export default function Layout() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-[#0B1519]">
        <Navbar />
        <UserSearchBar />
      </div>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
