// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import "./index.css";

import App from "./App";
import ProfilePage from "./pages/ProfilePage";
import BuyPage from "./pages/BuyPage";
import SellPage from "./pages/SellPage";
import AboutPage from "./pages/AboutPage";
import Layout from "./components/Layout";
import BuyboxDirectoryPage from "./pages/BuyboxDirectory";
import AnalyticsPage from "./pages/AnalyticsPage";
import BuyingCenterPage from "./pages/BuyingCenterPage"; // ✅ NEW IMPORT

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/buybox-directory" element={<BuyboxDirectoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/buying-center" element={<BuyingCenterPage />} /> {/* ✅ NEW ROUTE */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThirdwebProvider>
  </React.StrictMode>
);
